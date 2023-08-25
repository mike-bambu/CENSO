<?php

namespace App\Http\Controllers\API\Sistema;

use Illuminate\Http\Request;
use Illuminate\Http\Response as HttpResponse;
use App\Http\Controllers\Controller;
//use Illuminate\Support\Facades\Input;
use Response, DB, Validator;
use Carbon\Carbon;
use App\Models\Sistema\Paciente;
use App\Models\Sistema\Atencion;
use App\Models\Sistema\Seguimiento;
use App\Models\Catalogos\Camas;

use App\Models\Sistema\SeguimientoDiagnostico;

class SeguimientoWebController extends Controller
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
            $data_seguimiento = $parametros['seguimientos'];



            $validation_rules = [
                'observaciones'         => 'required:seguimientos',
                'estado_actual_id'      => 'required:seguimientos',
                'especialidad_id'       => 'required:seguimientos',
                'factor_covid_id'       => 'required:seguimientos'                         
            ];
        
            $validation_eror_messages = [

                'observaciones.required'            => 'Es Obligatoria la captura de las Observaciones',
                'estado_actual_id.required'         => 'El Estado de Salud Actual es obligatorio',
                'especialidad_id.required'          => 'La Espacialidad es Obligatoria',
                'factor_covid_id.required'          => 'La Enfermedad Respiratoria/COVID es Obligatoria'

            ];



            $resultado = Validator::make($data_seguimiento,$validation_rules,$validation_eror_messages);

            if (is_array($data_seguimiento))
            $data_seguimiento = (object) $data_seguimiento;

            if($resultado->passes()){

                DB::beginTransaction();

                $seguimiento = new Seguimiento();
                $seguimiento->fecha_seguimiento             =     $data_seguimiento->fecha_seguimiento;
                $seguimiento->hora_seguimiento              =     $data_seguimiento->hora_seguimiento;       
                $seguimiento->folio_seguimiento             =     $data_seguimiento->folio_seguimiento;
                $seguimiento->observaciones                 =     mb_strtoupper($data_seguimiento->observaciones, 'UTF-8');
                $seguimiento->observaciones_diagnosticos    =     mb_strtoupper($data_seguimiento->observaciones_diagnosticos, 'UTF-8');
                $seguimiento->no_cama                       =     property_exists($data_seguimiento, "no_actual_cama") ? $data_seguimiento->no_actual_cama : $seguimiento->no_cama;
                $seguimiento->cama_id                       =     $data_seguimiento->cama_id;
                //$seguimiento->codigoMatter                  =     $data_seguimiento->codigoMatter;
                $seguimiento->servicio_id                   =     $data_seguimiento->servicio_actual_id;
                $seguimiento->atencion_id                   =     $data_seguimiento->atencion_id;
                $seguimiento->estado_actual_id              =     $data_seguimiento->estado_actual_id;
                $seguimiento->especialidad_id               =     $data_seguimiento->especialidad_id;
                $seguimiento->factor_covid_id               =     $data_seguimiento->factor_covid_id;
                
                if($seguimiento->save()){

                    // if(!empty($data_seguimiento->diagnosticos) ){
    
                    //     foreach ($data_seguimiento->diagnosticos as $diagnostico) {
    
                    //         $diagnosticos = new SeguimientoDiagnostico();
    
                    //         $diagnosticos->folio_seguimiento_diagnostico         = $diagnostico['folio_seguimiento_diagnostico'].$seguimiento->id;
                    //         $diagnosticos->seguimiento_id                        = $seguimiento->id;
                    //         $diagnosticos->diagnostico_id                        = $diagnostico['diagnostico_id'];
    
                    //         $diagnosticos->save();
    
                    //     }
    
                    // }else{
                    //     $data_seguimiento->diagnosticos = [];
                    // }

                    
                    

                    if($data_seguimiento->cama_anterior_id !== $data_seguimiento->cama_actual_id){

                        DB::table('camas')
                        ->where('id', $data_seguimiento->cama_anterior_id)
                        ->update([
                            'estatus_cama_id'   => 1,
                            "updated_at"        => Carbon::now(),
                        ]);

                        DB::table('camas')
                        ->where('id', $data_seguimiento->cama_actual_id)
                        ->update([
                            'estatus_cama_id'   => 3,
                            "updated_at"        => Carbon::now(),
                        ]);

                        DB::table('atenciones')
                        ->where('id', $data_seguimiento->atencion_id)
                        ->update([

                            'esAmbulatoria'                 => $data_seguimiento->esAmbulatoria,

                            'ultimo_servicio_id'            => $data_seguimiento->servicio_actual_id,
                            'ultima_cama_id'                => $data_seguimiento->cama_id,
                            'ultimo_no_cama'                => property_exists($data_seguimiento, "no_actual_cama") ? $data_seguimiento->no_actual_cama : NULL,
                            'ultimo_estado_actual_id'       => $data_seguimiento->estado_actual_id,
                            'ultima_especialidad_id'        => $data_seguimiento->especialidad_id,
                            'ultimo_factor_covid_id'        => $data_seguimiento->factor_covid_id,


                            "updated_at"        => Carbon::now(),
                            
                        ]);

                        // $cama_anterior = Camas::find($data_seguimiento->cama_anterior_id);
                        // $cama_anterior->estatus_cama_id = 1;
                        //$data_seguimiento->estatus_cama_anterior_id = 4;

                        // $cama_actual   = Camas::find($data_seguimiento->cama_actual_id);
                        // $cama_actual->estatus_cama_id = 4;
                        //$data_seguimiento->estatus_cama_actual_id = 1;

                        // $atencion = Atencion::find($data_seguimiento->atencion_id);
                        // $atencion->no_cama      = $data_seguimiento->no_actual_cama;
                        // $atencion->servicio_id  = $data_seguimiento->servicio_actual_id;
                        
                    }else if($data_seguimiento->cama_anterior_id === $data_seguimiento->cama_actual_id){

                        DB::table('camas')
                        ->where('id', $data_seguimiento->cama_actual_id)
                        ->update([
                            'estatus_cama_id'   => 3,
                            "updated_at"        => Carbon::now(),
                        ]);

                        // $cama   = Camas::find($data_seguimiento->cama_actual_id);
                        // $cama->estatus_cama_id = 4;

                        // $atencion = Atencion::find($data_seguimiento->atencion_id);
                        // $atencion->no_cama      = $data_seguimiento->no_actual_cama;
                        // $atencion->servicio_id  = $data_seguimiento->servicio_actual_id;

                    }
                    
                
                    DB::table('atenciones')
                    ->where('id', $data_seguimiento->atencion_id)
                    //->where('folio_atencion', $data_seguimiento->folio_atencion)
                    ->update([
                        
                        'esAmbulatoria'                 => $data_seguimiento->esAmbulatoria,

                        'ultimo_servicio_id'            => $data_seguimiento->servicio_actual_id,
                        'ultima_cama_id'                => $data_seguimiento->cama_id,
                        'ultimo_no_cama'                => property_exists($data_seguimiento, "no_actual_cama") ? $data_seguimiento->no_actual_cama : NULL,
                        'ultimo_estado_actual_id'       => $data_seguimiento->estado_actual_id,
                        'ultima_especialidad_id'        => $data_seguimiento->especialidad_id,
                        'ultimo_factor_covid_id'        => $data_seguimiento->factor_covid_id,

                        "updated_at"        => Carbon::now(),
                    ]);
    
                    DB::commit();

                }


                //return response()->json(['data'=>$parametros],HttpResponse::HTTP_OK);
                return Response::json(array("status" => 200, "messages" => "¡Se registro el Seguimiento con Éxito!", "data" => $parametros), 200);
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
        // ME MANDAS EL FOLIO PACIENTE Y TE MANDO EL ULTIMO SEGUIMIENTO.

        $seguimiento = Seguimiento::select('seguimientos.*')->with('estado_actual', 'factor_covid', 'servicio', 'diagnosticos')
                                    ->where('paciente_id', '=', $id)
                                    ->orderBy('id', 'desc')->first();
        

        if(!$seguimiento){
            return Response::json(array("error" => 404, "messages" => "No se encontro el seguimiento"), 404);
            //404
        }

        return response()->json(['seguimiento' => $seguimiento], 200);
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
}
