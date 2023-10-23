<?php

namespace App\Http\Controllers\API\Sistema;

use Illuminate\Http\Response as HttpResponse;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

//use Illuminate\Support\Facades\Input;
use Response, DB, Validator;

use App\Models\Sistema\Paciente;
use App\Models\Sistema\Alta;
use App\Models\Sistema\Atencion;
use App\Models\Sistema\Embarazo;
use App\Models\Sistema\AltaDiagnostico;


use Carbon\Carbon;

class AtencionesWebController extends Controller
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

            $parametros    = $request->all();
            $data_atencion = $parametros['atencion'];
            $data_embarazo = $parametros['embarazo'];



            $validation_rules = [

                'fecha_inicio_atencion'           => 'required:atenciones',
                'hora'                            => 'required:atenciones',
                // 'estado_actual_id'                => 'required:atenciones',
                'motivo_atencion'                 => 'required:atenciones',
                'indicaciones'                    => 'required:atenciones',            
            ];
        
            $validation_eror_messages = [

                'fecha_inicio_atencion.required'              => 'Es Obligatoria la fecha de atención',
                'hora.required'                               => 'Es Obligatoria la hora de atención',
                // 'estado_actual_id.required'                   => 'Es Obligatoria la hora de atención',                
                'motivo_atencion.required'                    => 'El Motivo de la atención obligatorio',
                'indicaciones.required'                       => 'Las Obervaciones de la atención son obligatorias',

            ];



            $resultado = Validator::make($data_atencion,$validation_rules,$validation_eror_messages);

            if (is_array($data_atencion))
            $data_atencion = (object) $data_atencion;

            if (is_array($data_embarazo))
            $data_embarazo = (object) $data_embarazo;

            if($resultado->passes()){

                DB::beginTransaction();

                $atencion = new Atencion();

                $atencion->folio_atencion              = mb_strtoupper($data_atencion->folio_atencion, 'UTF-8');
                $atencion->esAmbulatoria               = $data_atencion->esAmbulatoria;
                $atencion->dadodeAlta                  = $data_atencion->dadodeAlta;
                $atencion->esUrgenciaCalificada        = $data_atencion->esUrgenciaCalificada;
                $atencion->fecha_inicio_atencion       = $data_atencion->fecha_inicio_atencion;   
                $atencion->hora                        = $data_atencion->hora;
                $atencion->estado_actual_id            = $data_atencion->estado_actual_id;
                $atencion->servicio_id                 = $data_atencion->servicio_id;
                $atencion->cama_id                     = $data_atencion->cama_id;
                $atencion->no_cama                     = property_exists($data_atencion, "no_cama") ? $data_atencion->no_cama: $atencion->no_cama;
                $atencion->motivo_atencion             = mb_strtoupper($data_atencion->motivo_atencion, 'UTF-8');;
                $atencion->indicaciones                = mb_strtoupper($data_atencion->indicaciones, 'UTF-8');
                $atencion->estaEmbarazada              = $data_atencion->estaEmbarazada;
                $atencion->haEstadoEmbarazada          = $data_atencion->haEstadoEmbarazada;
                $atencion->codigoMater                 = $data_atencion->codigoMater;
                $atencion->clues_id                    = $data_atencion->clues_id;
                $atencion->paciente_id                 = $data_atencion->paciente_id;

                $atencion->ultimo_servicio_id          = $data_atencion->servicio_id;
                $atencion->ultima_cama_id              = $data_atencion->cama_id;
                $atencion->ultimo_no_cama              = property_exists($data_atencion, "no_cama") ? $data_atencion->no_cama: $atencion->no_cama;
                $atencion->ultimo_estado_actual_id     = $data_atencion->estado_actual_id;
                $atencion->ultimo_factor_covid_id      = $data_atencion->ultimo_factor_covid_id;

                if($atencion->save()){

                    DB::table('pacientes')
                    ->where('id', $data_atencion->paciente_id)
                    ->update([
                        'tieneAtencion'         => 1,
                    ]);

                    DB::table('camas')
                    ->where('id', $data_atencion->cama_id)
                    ->where('numero', property_exists($data_atencion, "no_cama") ? $data_atencion->no_cama: $atencion->no_cama)
                    ->where('servicio_id', $data_atencion->servicio_id)
                    ->update([
                        'estatus_cama_id'   => 3,
                        "updated_at"        => Carbon::now(),
                    ]);

                    
                    if( $data_atencion->estaEmbarazada || $data_atencion->haEstadoEmbarazada ){

                        $embarazo = new Embarazo();

                        $embarazo->fueReferida                       = $data_embarazo->fueReferida                   ;
                        $embarazo->gestas                            = $data_embarazo->gestas                        ;
                        $embarazo->partos                            = $data_embarazo->partos                        ;
                        $embarazo->cesareas                          = $data_embarazo->cesareas                      ;
                        $embarazo->abortos                           = $data_embarazo->abortos                       ;
                        $embarazo->fecha_ultima_mestruacion          = $data_embarazo->fecha_ultima_mestruacion;
                        $embarazo->fecha_control_embarazo            = $data_embarazo->fecha_control_embarazo;
                        $embarazo->semanas_gestacionales             = $data_embarazo->semanas_gestacionales         ;
                        $embarazo->fecha_ultimo_parto                = $data_embarazo->fecha_ultimo_parto;
                        $embarazo->puerperio                         = $data_embarazo->puerperio;
                        $embarazo->metodo_gestacional_id             = $data_embarazo->metodo_gestacional_id         ;
                        $embarazo->clues_referencia_id               = $data_embarazo->clues_referencia_id           ;
                        $embarazo->clue_atencion_embarazo_id         = $data_embarazo->clue_atencion_embarazo_id     ;
                        $embarazo->fecha_ultima_atencion_embarazo    = $data_embarazo->fecha_ultima_atencion_embarazo;
                        $embarazo->clues_control_embarazo_id         = $data_embarazo->clues_control_embarazo_id     ;
                        $embarazo->paciente_id                       = $data_atencion->paciente_id;

                        $embarazo->save();
                    }

                }



                DB::commit();

                //return response()->json(['data'=>$parametros],HttpResponse::HTTP_OK);
                return Response::json(array("status" => 200, "messages" => "¡Se registro con Éxito la Atención!", "data" => $parametros), 200);
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
