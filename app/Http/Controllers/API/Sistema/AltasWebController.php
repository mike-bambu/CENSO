<?php

namespace App\Http\Controllers\API\Sistema;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

//use Illuminate\Support\Facades\Input;
use Response, DB, Validator;

use App\Models\Sistema\Paciente;
use App\Models\Sistema\Alta;
use App\Models\Sistema\Atencion;
use App\Models\Sistema\AltaDiagnostico;


use Carbon\Carbon;

class AltasWebController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        //
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {

        try {

            $parametros = $request->all();
            $data_alta = $parametros['alta'];



            $validation_rules = [
                'observaciones'         => 'required:altas',
                'motivo_egreso_id'      => 'required:altas',
                'fecha_alta'            => 'required:altas',            
            ];
        
            $validation_eror_messages = [

                'observaciones.required'            => 'Es Obligatoria la captura de las Observaciones',
                'motivo_egreso_id.required'         => 'El Motivo del Egreso es obligatorio',
                'fecha_alta.required'               => 'La Fecha de Egreso es obligatoria', 

            ];



            $resultado = Validator::make($data_alta,$validation_rules,$validation_eror_messages);

            if (is_array($data_alta))
            $data_alta = (object) $data_alta;

            if($resultado->passes()){

                DB::beginTransaction();

                $alta = new Alta();
                                                   
                $alta->folio_alta                    =     $data_alta->folio_alta;                       
                $alta->fecha_alta                    =     $data_alta->fecha_alta;
                $alta->hora_alta                     =     $data_alta->hora_alta; 
                $alta->observaciones_diagnosticos    =     mb_strtoupper($data_alta->observaciones_diagnosticos, 'UTF-8');                      
                $alta->observaciones                 =     mb_strtoupper($data_alta->observaciones, 'UTF-8');
                $alta->esPuerperaEmbarazada          =     $data_alta->esPuerperaEmbarazada;                                      
                $alta->telefono                      =     $data_alta->telefono;                          
                $alta->direccion_completa            =     $data_alta->direccion_completa;                                       
                $alta->motivo_egreso_id              =     $data_alta->motivo_egreso_id;                                   
                $alta->condicion_egreso_id           =     $data_alta->condicion_egreso_id;                                       
                $alta->estado_actual_id              =     $data_alta->estado_actual_id;                                   
                $alta->metodo_anticonceptivo_id      =     $data_alta->metodo_anticonceptivo_id;                                           
                $alta->municipio_id                  =     $data_alta->municipio_id;                             
                $alta->localidad_id                  =     $data_alta->localidad_id;                              
                $alta->atencion_id                   =     $data_alta->atencion_id;                             
                
                if($alta->save()){

                    // if(!empty($data_alta->diagnosticos) ){
    
                    //     foreach ($data_alta->diagnosticos as $diagnostico) {
    
                    //         $diagnosticos = new AltaDiagnostico();
    
                    //         $diagnosticos->folio_alta_diagnostico                = $diagnostico['folio_alta_diagnostico']
                    //         ;
                    //         $diagnosticos->seguimiento_id                        = $alta->id;
                    //         $diagnosticos->diagnostico_id                        = $diagnostico['diagnostico_id'];
    
                    //         $diagnosticos->save();
    
                    //     }
    
                    // }else{
                    //     $data_seguimiento->diagnosticos = [];
                    // }

                    DB::table('atenciones')
                    ->where('id', $data_alta->atencion_id)
                    ->update([
                        'dadodeAlta'        => $data_alta->dadodeAlta,
                        "updated_at"        => Carbon::now(),
                    ]);
    
                    DB::table('pacientes')
                    ->where('id', $data_alta->paciente_id)
                    ->update([
                        'tieneAtencion'     => $data_alta->tieneAtencion,
                        "updated_at"        => Carbon::now(),
                    ]);
    
                    DB::table('camas')
                    ->where('id', $data_alta->cama_id) 
                    //->where('numero', $data_alta->no_cama)
                    ->where('servicio_id',  $data_alta->servicio_id)
                    ->update([
                        'estatus_cama_id'   => 1,
                        "updated_at"        => Carbon::now(),
                    ]);

                }

                DB::commit();

                //return response()->json(['data'=>$parametros],HttpResponse::HTTP_OK);
                return Response::json(array("status" => 200, "messages" => "¡Se registro el Alta con Éxito!", "data" => $parametros), 200);
            }else{
                return response()->json(['mensaje' => 'Error en los datos del formulario', 'validacion'=>$resultado->passes(), 'errores'=>$resultado->errors()], HttpResponse::HTTP_CONFLICT);
            }

        }
        catch (\Exception $e) {
            return Response::json($e->getMessage(), 500);
        }
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function edit($id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        //
    }

    public function getDispositivosAltas(Request $request){

        //en un futuro mandaria un array de folios para casarlos con los pacientes ingresado que sean distintos de los que mande migue.

        try{
            
            $parametros = $request->all();

            $altas = DB::table('altas')
                        ->join('pacientes as PS', 'altas.paciente_id', '=', 'PS.id')
                        ->where('PS.clues', '=', $parametros['altas'][0]['clues'])
                        ->whereNotIn('folio_alta', $parametros['altas'][1]['folios_altas'])
                        ->select('altas.*', 'PS.folio_paciente')
                        ->get();

            if(!$altas){
                return Response::json(array("status" => 204, "messages" => "No hay altas por sincronizar", "altas" => $altas), 204);
                //204
            }
                
            
            return Response::json(array("status" => 200, "messages" => "Sincronización Exitosa", "altas" => $altas), 200);

        }catch(\Exception $e){
            return response()->json(['error'=>['message'=>$e->getMessage(),'line'=>$e->getLine()]], HttpResponse::HTTP_CONFLICT);
        }

    }
}
