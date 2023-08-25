<?php

namespace App\Http\Controllers\API\Sistema;

use Illuminate\Http\Response as HttpResponse;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

use Illuminate\Support\Facades\DB;
use Illuminate\Database\Eloquent\Collection;
use Response, Validator;
use Carbon\Carbon;

use App\Models\Sistema\Paciente;
use App\Models\Sistema\Atencion;

class AtencionesController extends Controller
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

        //$data = Input::json()->all();
        $data = $request->all();
        $data = (object) $data;

        try {

            if(property_exists($data, "atenciones")){
                $atenciones = array_filter($data->atenciones, function($v){return $v !== null;});
                foreach ($atenciones as $key => $value) {
                    //validar que el valor no sea null
                    if($value != null){
                        //comprobar si el value es un array, si es convertirlo a object mas facil para manejar.
                        if(is_array($value))
                            $value = (object) $value;

                            if($paciente = Paciente::where('folio_paciente', '=', $value->folio_paciente)->first()){

                                //$paciente = Paciente::where('folio_paciente', '=', $value->folio_paciente)->first();

                                 $atencion = new Atencion();

                                 $atencion->folio_atencion                      =   $value->folio_atencion;
                                 $atencion->fecha_inicio_atencion               =   $value->fecha_inicio_atencion;
                                 $atencion->hora                                =   $value->hora;
                                 $atencion->motivo_atencion                     =   mb_strtoupper($value->motivo_atencion, 'UTF-8');
                                 $atencion->indicaciones                        =   mb_strtoupper($value->indicaciones, 'UTF-8');
                                 $atencion->gestas                              =   $value->gestas;
                                 $atencion->partos                              =   $value->partos;
                                 $atencion->cesareas                            =   $value->cesareas;
                                 $atencion->abortos                             =   $value->abortos;
                                 $atencion->semanas_gestacionales               =   $value->semanas_gestacionales;
                                 $atencion->estaEmbarazada                      =   $value->estaEmbarazada;
                                 $atencion->fueReferida                         =   $value->fueReferida;
                                 $atencion->metodo_gestacional_id               =   $value->metodo_gestacional_id;
                                 $atencion->clues_referencia                    =   $value->clues_referencia;
                                 $atencion->dadodeAlta                          =   $value->dadodeAlta;
                                 $atencion->estado_actual_id                    =   $value->estado_actual_id;
                                 $atencion->servicio_id                         =   $value->servicio_id;
                                 $atencion->no_cama                             =   $value->no_cama;                                 
                                 $atencion->especialidad_id                     =   $value->especialidad_id;
                                 $atencion->clue_atencion_embarazo              =   $value->clue_atencion_embarazo;
                                 $atencion->fecha_ultima_atencion_embarazo      =   $value->fecha_ultima_atencion_embarazo;
                                 $atencion->clues_control_embarazo              =   $value->clues_control_embarazo;
                                 $atencion->fecha_control_embarazo              =   $value->fecha_control_embarazo;
                                 $atencion->clues_id                            =   $value->clues_id;
                                 $atencion->paciente_id                         =   $paciente->id;

                                 if($atencion->save())

                                 DB::table('pacientes')
                                 ->where('folio_paciente',  $value->folio_paciente)
                                 ->update([
                                     'estado_actual_id'   => $value->estado_actual_id,
                                     'tieneAtencion'       => 1,
                                ]);

                                // DB::table('pacientes')
                                // ->where('folio_paciente', $value->folio_paciente)
                                // ->update([
                                //     'estado_actual_id'   => $value->estado_actual_id,
                                // ]);


                            }
                    }
                }
                return Response::json(array("status" => 200, "messages" => "Se agrego la atención con exito", "data" => $data), 200);
            }
            else{
                return Response::json(array("error" => 404, "messages" => "No se registro la atención"), 404);
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

    // public function updateAtencion(Request $request)
    // {
    //     try {

    //         $data = $request->all();
        
    //         $atencion = Atencion::where('folio_atencion', '=', $data['folio_atencion'])->first();
    //         $atencion->esAmbulatoria = $data['esAmbulatoria'];


    //         if($atencion->save()){

    //             return Response::json(array("status" => 200, "messages" => "Se actualizo la atención a un Servicio", "data" => $data), 200);

    //         }else{

    //             return Response::json(array("error" => 404, "messages" => "No se actualizo la atención a un servicio"), 404);
                
    //         }


    //     } catch (\Throwable $e) {

    //         return Response::json($e->getMessage(), 500);

    //     }
    // }

    public function updateAtencion(Request $request)
    {


        $data = $request->all();
        $data = (object) $data;

        try {

            if(property_exists($data, "atenciones_ambulatorias")){
                $atenciones_ambulatorias = array_filter($data->atenciones_ambulatorias, function($v){return $v !== null;});
                foreach ($atenciones_ambulatorias as $key => $value) {
                    //validar que el valor no sea null
                    if($value != null){
                        //comprobar si el value es un array, si es convertirlo a object mas facil para manejar.
                        if(is_array($value))
                            $value = (object) $value;

                            $atencion = Atencion::where('folio_atencion', '=', $value->folio_atencion)->first();

                            if($atencion){

                                 $atencion->folio_atencion                      =   $value->folio_atencion;
                                 $atencion->esAmbulatoria                       =   $value->esambulatorio;
                                 $atencion->save();

                            }
                    }
                }
                return Response::json(array("status" => 200, "messages" => "Se actualizo la atención a un Servicio", "data" => $data), 200);
            }
            else{
                return Response::json(array("error" => 404, "messages" => "No se actualizo la atención a un servicio"), 404);
            }
        }
        catch (\Exception $e) {
            return Response::json($e->getMessage(), 500);
        }



    }

    public function getAtencionesUltimoSeguimiento(Request $request)
    {

        $parametros = $request->all();

        try{
            

            $atenciones = Atencion::select('atenciones.*')->with('ultimoSeguimiento', 'cama_actual', 'servicio_actual')
                            // ->join('atenciones as ATEN', 'ATEN.id', '=', 'altas.atencion_id')
                            // ->join('pacientes  as PACI', 'PACI.id', '=', 'ATEN.paciente_id')
                            ->where('clues_id', '=', $parametros['atenciones'][0]['clues'])
                            ->where('dadodeAlta', '=', 0)
                            ->whereIn('folio_atencion', $parametros['atenciones'][1]['folios_atenciones'])
                            ->get();

            if(!$atenciones){
                return Response::json(array("status" => 204, "messages" => "No hay atenciones por Descargar", "atenciones" => $atenciones), 204);
                //204
            }
                
            
            return Response::json(array("status" => 200, "messages" => "Descarga Exitosa", "atenciones" => $atenciones), 200);

        }catch(\Exception $e){
            return response()->json(['error'=>['message'=>$e->getMessage(),'line'=>$e->getLine()]], HttpResponse::HTTP_CONFLICT);
        }

        

    }


}
