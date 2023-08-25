<?php

namespace App\Http\Controllers\API\Reportes;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Http\Response as HttpResponse;
use Illuminate\Support\Facades\DB;

use Response, Validator;
use Carbon\Carbon;

use App\Models\Sistema\Paciente;


class ReportesController extends Controller
{

    public function reportePacientesHospitalizados(Request $request)
    {

        $actual = Carbon::today()->toDateString();
        $hoy = Carbon::createFromDate($actual)->format('Y-m-d');

        $parametros = $request->all();
        $usuario = auth()->userOrFail();

        $permiso_todos = DB::table('permissions')
        ->leftJoin('permission_user', 'permissions.id', '=', 'permission_user.permission_id')
        ->where('permission_user.user_id', '=', $usuario->id)
        ->where('permission_user.permission_id', '=', 'P5gCJH25AeIwy2IOmvCYtHKg5XL3hKd0')
        ->first();

        //P5gCJH25AeIwy2IOmvCYtHKg5XL3hKd0 (ver Todos los pacientes)

        $userClues = DB::table('clue_user')
        ->where('user_id', $usuario->id)->first();

        $userServicio = DB::table('servicio_user')
        ->where('user_id', $usuario->id)->first();


        try{

            if($userClues && $permiso_todos != NULL){


                $pacientes = Paciente::select('pacientes.*')
                ->with('municipio', 'localidad', 'pais_origen', 'estado_republica', 'embarazo', 'atenciones.seguimientos', 'atenciones.alta', 'ultimaAtencion', 'ultimaAtencion.ultimoSeguimiento', 'ultimaAtencion.alta')
                ->leftJoin('atenciones as ATN', 'ATN.paciente_id', '=', 'pacientes.id')
                // ->leftJoin('seguimientos', function($query){
                //     $query->on('ATN.id','=','seguimientos.atencion_id')
                //     ->whereRaw('seguimientos.id IN (select MAX(SEG.id) from seguimientos as SEG join atenciones as ATEN_ACT on ATEN_ACT.id = SEG.atencion_id group by ATEN_ACT.id)');
                //})
                ->where('tieneAtencion', 1)
                ->where('ATN.clues_id', $userClues->clue_id)
                ->where('ATN.esAmbulatoria', 0)
                ->where('ATN.dadodeAlta', 0)
                ->orderBy('ATN.ultimo_no_cama', 'DESC');
                //->orderBy('SEG.id', 'ASC')->distinct();
                //->orderBy('SEG.servicio_id', 'DESC', 'SEG.no_cama', 'DESC')->distinct();
                //->groupBy('ATN.servicio_id', 'pacientes.*')->distinct();

            }else if($userServicio){

                $pacientes = Paciente::select('pacientes.*')
                ->with('municipio', 'localidad', 'pais_origen', 'estado_republica', 'embarazo', 'atenciones.seguimientos', 'atenciones.alta', 'ultimaAtencion', 'ultimaAtencion.ultimoSeguimiento', 'ultimaAtencion.alta')
                ->leftJoin('atenciones as ATN', 'ATN.paciente_id', '=', 'pacientes.id')
                // ->leftJoin('seguimientos', function($query) {
                //     $query->on('ATN.id','=','seguimientos.atencion_id')
                //     ->whereRaw('seguimientos.id IN (select MAX(SEG.id) from seguimientos as SEG join atenciones as ATEN_ACT on ATEN_ACT.id = SEG.atencion_id group by ATEN_ACT.id)');
                // })
                //->leftJoin('seguimientos as SEG', 'SEG.atencion_id', '=', 'ATN.id')
                ->where('tieneAtencion', 1)
                ->where('ATN.ultimo_servicio_id', $userServicio->servicio_id)
                ->where('ATN.clues_id', $userClues->clue_id)
                ->where('ATN.esAmbulatoria', 0)
                ->where('ATN.dadodeAlta', 0)
                ->orderBy('ATN.ultimo_no_cama', 'DESC');
                //->groupBy('ATN.servicio_id', 'pacientes.*')->distinct();

            }





            if(isset($parametros['query']) && $parametros['query']){
                $pacientes = $pacientes->where(function($query)use($parametros){
                    return $query->whereRaw('concat(nombre," ", paterno, " ", materno) like "%'.$parametros['query'].'%"' )
                                ->orWhere('folio_paciente','LIKE','%'.$parametros['query'].'%')
                                ->orWhere('numero_expediente','LIKE','%'.$parametros['query'].'%')
                                ->orWhere('alias','LIKE','%'.$parametros['query'].'%')
                                ->orWhere('curp','LIKE','%'.$parametros['query'].'%')
                                ->orWhere('nombre','LIKE','%'.$parametros['query'].'%')
                                ->orWhere('paterno','LIKE','%'.$parametros['query'].'%')
                                ->orWhere('materno','LIKE','%'.$parametros['query'].'%')
                                ->orWhere('telefono_emergencia','LIKE','%'.$parametros['query'].'%')
                                ->orWhere('telefono_celular','LIKE','%'.$parametros['query'].'%');
                });
            }

            if(isset($parametros['active_filter']) && $parametros['active_filter']){


                if(isset($parametros['query']) && $parametros['query']){
                    $pacientes = $pacientes->where(function($query)use($parametros){
                        return $query->whereRaw('concat(nombre," ", paterno, " ", materno) like "%'.$parametros['query'].'%"' )
                                    ->orWhere('folio_paciente','LIKE','%'.$parametros['query'].'%')
                                    ->orWhere('numero_expediente','LIKE','%'.$parametros['query'].'%')
                                    ->orWhere('alias','LIKE','%'.$parametros['query'].'%')
                                    ->orWhere('curp','LIKE','%'.$parametros['query'].'%')
                                    ->orWhere('nombre','LIKE','%'.$parametros['query'].'%')
                                    ->orWhere('paterno','LIKE','%'.$parametros['query'].'%')
                                    ->orWhere('materno','LIKE','%'.$parametros['query'].'%')
                                    ->orWhere('telefono_emergencia','LIKE','%'.$parametros['query'].'%')
                                    ->orWhere('telefono_celular','LIKE','%'.$parametros['query'].'%');
                    });
                }


                // if(isset($parametros['estados_actuales']) && $parametros['estados_actuales']){
                    
                //     $pacientes = $pacientes->where('estado_actual_id',$parametros['estados_actuales']);
                
                // }

                if(isset($parametros['fecha_inicio'], $parametros['fecha_fin'])){

                    $pacientes = $pacientes->whereBetween(DB::raw('DATE(ATN.fecha_inicio_atencion)'), [$parametros['fecha_inicio'], $parametros['fecha_fin']]);

                }

                if(isset($parametros['tipo_edad'], $parametros['edad'])){

                        $pacientes = $pacientes->where('tipo_edad', $parametros['tipo_edad'])->where('edad', $parametros['edad']);

                    //$pacientes = $pacientes->where('edad',$parametros['edad']);

                }

                if(isset($parametros['sexo']) && $parametros['sexo']){

                    $pacientes = $pacientes->where('sexo',$parametros['sexo']);

                }

                if(isset($parametros['nacionalidad'])){


                    $pacientes = $pacientes->where('esExtranjero',$parametros['nacionalidad']);

                }

                if(isset($parametros['atencion'])){


                    $pacientes = $pacientes->where('tieneAtencion',$parametros['atencion']);

                }

                if(isset($parametros['identidad'])){

                    $pacientes = $pacientes->where('esDesconocido',$parametros['identidad']);

                }

                

                if(isset($parametros['municipio_id']) && $parametros['municipio_id']){

                    $pacientes = $pacientes->where('municipio_id',$parametros['municipio_id']);

                }

                if(isset($parametros['localidad_id']) && $parametros['localidad_id']){

                    $pacientes = $pacientes->where('localidad_id',$parametros['localidad_id']);

                }

                if(isset($parametros['municipio_id'], $parametros['localidad_id'])){

                    $pacientes = $pacientes->where(function($q)use ($parametros) {
                        $q->where('municipio_id',  $parametros['municipio_id'])
                        ->orWhere('localidad_id',  $parametros['localidad_id']);
                    });

                }

                if(isset($parametros['especialidad_id']) && $parametros['especialidad_id']){

                    //$pacientes = $pacientes->where('ATN.especialidad_id',$parametros['especialidad_id'])->distinct();

                    $pacientes = $pacientes->where('ATN.ultima_especialidad_id', $parametros['especialidad_id']);

                }

                // if(isset($parametros['servicio_id']) && $parametros['servicio_id']){

                //     $pacientes = $pacientes->where('ATN.servicio_id',$parametros['servicio_id'])->distinct();

                // }

                if(isset($parametros['servicios']) && $parametros['servicios']){

                    // $pacientes = $pacientes->whereIn('ATN.servicio_id', $parametros['servicios']);

                    $pacientes = $pacientes->whereIn('ATN.ultimo_servicio_id', $parametros['servicios']);

                }

                if(isset($parametros['estado_actual_id']) && $parametros['estado_actual_id']){

                    $pacientes = $pacientes->where('ATN.ultimo_estado_actual_id',$parametros['estado_actual_id']);

                }

            }

            if(isset($parametros['page'])){
                $resultadosPorPagina = isset($parametros["per_page"])? $parametros["per_page"] : 20;
    
                $pacientes = $pacientes->paginate($resultadosPorPagina);
            } else {
                $pacientes = $pacientes->get();
            }


            return response()->json(['data'=>$pacientes, 'fecha_actual'=>$hoy],HttpResponse::HTTP_OK);

        }catch(\Throwable $e){
            return response()->json(['error'=>['message'=>$e->getMessage(),'line'=>$e->getLine()]], HttpResponse::HTTP_CONFLICT);
        }
        
    }

    public function reportePacientesAmbulatorios(Request $request)
    {

        $actual = Carbon::today()->toDateString();
        $hoy = Carbon::createFromDate($actual)->format('Y-m-d');

        $parametros = $request->all();
        
        $usuario = auth()->userOrFail();

        $permiso_todos = DB::table('permissions')
        ->leftJoin('permission_user', 'permissions.id', '=', 'permission_user.permission_id')
        ->where('permission_user.user_id', '=', $usuario->id)
        ->where('permission_user.permission_id', '=', 'P5gCJH25AeIwy2IOmvCYtHKg5XL3hKd0')
        ->first();

        //P5gCJH25AeIwy2IOmvCYtHKg5XL3hKd0 (ver Todos los pacientes)

        $userClues = DB::table('clue_user')
        ->where('user_id', $usuario->id)->first();

        $userServicio = DB::table('servicio_user')
        ->where('user_id', $usuario->id)->first();

        try{

            if($userClues && $permiso_todos != NULL){

                $pacientes = Paciente::select('pacientes.*')->with('municipio', 'localidad', 'estado_republica', 'pais_origen', 'embarazo', 'ultimaAtencion.ultimoSeguimiento')
                ->leftJoin('atenciones as ATN_GENERAL', 'ATN_GENERAL.paciente_id', '=', 'pacientes.id')
                // ->leftJoin('seguimientos', function($query){
                //     $query->on('ATN_GENERAL.id','=','seguimientos.atencion_id')
                //     ->whereRaw('seguimientos.id IN (select MAX(SEG.id) from seguimientos as SEG join atenciones as ATEN_ACT on ATEN_ACT.id = SEG.atencion_id group by ATEN_ACT.id)');
                // })
                ->where('pacientes.tieneAtencion', 1)
                ->where('ATN_GENERAL.clues_id', $userClues->clue_id)
                ->where('ATN_GENERAL.esAmbulatoria', 1)
                ->where('ATN_GENERAL.dadodeAlta', 0)
                ->orderBy('ATN_GENERAL.ultimo_servicio_id', 'ASC')
                ->orderByRaw('ISNULL(ATN_GENERAL.ultimo_no_cama), ultimo_no_cama ASC');
        
            } else if($userServicio){

                $pacientes = Paciente::select('pacientes.*')->with('municipio', 'localidad', 'estado_republica', 'pais_origen', 'embarazo', 'ultimaAtencion.ultimoSeguimiento')
                ->leftJoin('atenciones as ATN_GENERAL', 'ATN_GENERAL.paciente_id', '=', 'pacientes.id')
                // ->leftJoin('seguimientos', function($query){
                //     $query->on('ATN_GENERAL.id','=','seguimientos.atencion_id')
                //     ->whereRaw('seguimientos.id IN (select MAX(SEG.id) from seguimientos as SEG join atenciones as ATEN_ACT on ATEN_ACT.id = SEG.atencion_id group by ATEN_ACT.id)');
                // })
                ->where('pacientes.tieneAtencion', 1)
                ->where('ATN_GENERAL.ultimo_servicio_id', $userServicio->servicio_id)
                ->where('ATN_GENERAL.clues_id', $userClues->clue_id)
                ->where('ATN_GENERAL.esAmbulatoria', 1)
                ->where('ATN_GENERAL.dadodeAlta', 0)
                ->orderBy('ATN_GENERAL.ultimo_servicio_id', 'ASC')
                ->orderByRaw('ISNULL(ATN_GENERAL.ultimo_no_cama), ultimo_no_cama ASC');
            }





            if(isset($parametros['query']) && $parametros['query']){
                $pacientes = $pacientes->where(function($query)use($parametros){
                    return $query->whereRaw('concat(nombre," ", paterno, " ", materno) like "%'.$parametros['query'].'%"' )
                                ->orWhere('folio_paciente','LIKE','%'.$parametros['query'].'%')
                                ->orWhere('numero_expediente','LIKE','%'.$parametros['query'].'%')
                                ->orWhere('alias','LIKE','%'.$parametros['query'].'%')
                                ->orWhere('curp','LIKE','%'.$parametros['query'].'%')
                                ->orWhere('nombre','LIKE','%'.$parametros['query'].'%')
                                ->orWhere('paterno','LIKE','%'.$parametros['query'].'%')
                                ->orWhere('materno','LIKE','%'.$parametros['query'].'%')
                                ->orWhere('telefono_emergencia','LIKE','%'.$parametros['query'].'%')
                                ->orWhere('telefono_celular','LIKE','%'.$parametros['query'].'%');
                });
            }

            if(isset($parametros['active_filter']) && $parametros['active_filter']){


                if(isset($parametros['query']) && $parametros['query']){
                    $pacientes = $pacientes->where(function($query)use($parametros){
                        return $query->whereRaw('concat(nombre," ", paterno, " ", materno) like "%'.$parametros['query'].'%"' )
                                    ->orWhere('folio_paciente','LIKE','%'.$parametros['query'].'%')
                                    ->orWhere('numero_expediente','LIKE','%'.$parametros['query'].'%')
                                    ->orWhere('alias','LIKE','%'.$parametros['query'].'%')
                                    ->orWhere('curp','LIKE','%'.$parametros['query'].'%')
                                    ->orWhere('nombre','LIKE','%'.$parametros['query'].'%')
                                    ->orWhere('paterno','LIKE','%'.$parametros['query'].'%')
                                    ->orWhere('materno','LIKE','%'.$parametros['query'].'%')
                                    ->orWhere('telefono_emergencia','LIKE','%'.$parametros['query'].'%')
                                    ->orWhere('telefono_celular','LIKE','%'.$parametros['query'].'%');
                    });
                }


                if(isset($parametros['numero_expediente']) && $parametros['numero_expediente']){

                    $pacientes = $pacientes->where('numero_expediente',$parametros['numero_expediente'])
                                           ->orWhere('numero_expediente','LIKE','%'.$parametros['numero_expediente'].'%');

                }

                if(isset($parametros['fecha_inicio'], $parametros['fecha_fin'])){
                    
                    $pacientes = $pacientes->whereBetween(DB::raw('DATE(ATN_GENERAL.fecha_inicio_atencion)'), [$parametros['fecha_inicio'], $parametros['fecha_fin']])->distinct();
                                           

                }

                if(isset($parametros['servicios']) && $parametros['servicios']){

                    //$pacientes = $pacientes->whereIn('ATN_GENERAL.servicio_id', $parametros['servicios']);
                    $pacientes = $pacientes->whereIn('ATN_GENERAL.ultimo_servicio_id', $parametros['servicios']);

                }

                if(isset($parametros['estado_actual_id']) && $parametros['estado_actual_id']){

                    $pacientes = $pacientes->where('ATN_GENERAL.ultimo_estado_actual_id',$parametros['estado_actual_id']);

                }

                if(isset($parametros['numero_cama']) && $parametros['numero_cama']){

                    $pacientes = $pacientes->where('ATN_GENERAL.ultimo_no_cama',$parametros['numero_cama'])
                                           ->orWhere('ATN_GENERAL.ultimo_no_cama','LIKE','%'.$parametros['numero_cama'].'%');

                }

            }

            if(isset($parametros['page'])){
                $resultadosPorPagina = isset($parametros["per_page"])? $parametros["per_page"] : 20;
    
                $pacientes = $pacientes->paginate($resultadosPorPagina);
            } else {
                $pacientes = $pacientes->get();
            }


            return response()->json(['data'=>$pacientes, 'fecha_actual'=>$hoy],HttpResponse::HTTP_OK);

        }catch(\Throwable $e){
            return response()->json(['error'=>['message'=>$e->getMessage(),'line'=>$e->getLine()]], HttpResponse::HTTP_CONFLICT);
        }
        
    }

    public function reporteAltas(Request $request)
    {
        try{

            $parametros = $request->all();

            $actual = Carbon::today()->toDateString();
            $hoy = Carbon::createFromDate($actual)->format('Y-m-d');

            $pacientes = Paciente::select('pacientes.*')->with('clues.distrito', 'municipio', 'localidad', 'metodo_gestacional', 'alta')
                                                        ->join('altas as A', 'A.paciente_id', '=', 'pacientes.id');


            if(isset($parametros['query']) && $parametros['query']){
                $pacientes = $pacientes->where(function($query)use($parametros){
                    return $query->whereRaw('concat(nombre," ", paterno, " ", materno) like "%'.$parametros['query'].'%"' )
                                ->orWhere('folio_paciente','LIKE','%'.$parametros['query'].'%')
                                ->orWhere('nombre','LIKE','%'.$parametros['query'].'%')
                                ->orWhere('paterno','LIKE','%'.$parametros['query'].'%')
                                ->orWhere('materno','LIKE','%'.$parametros['query'].'%');
                });
            }

            if(isset($parametros['active_filter']) && $parametros['active_filter']){

                if(isset($parametros['distrito_id']) && $parametros['distrito_id']){

                    $pacientes = $pacientes->leftJoin('clues as CLUE', 'CLUE.id', '=', 'pacientes.clues')
                                           ->leftJoin('jurisdicciones as DIST', 'DIST.id', '=', 'CLUE.jurisdicciones_id')
                                           ->where('DIST.id', $parametros['distrito_id'])
                                           ->orderBy('fecha_ingreso', 'DESC');

                }

                if(isset($parametros['clues_id']) && $parametros['clues_id']){

                    $pacientes = $pacientes->where('clues',$parametros['clues_id']);

                }

                if(isset($parametros['motivo_egreso_id']) && $parametros['motivo_egreso_id']){
                    
                    $pacientes = $pacientes->where('A.motivo_egreso_id', $parametros['motivo_egreso_id']);

                }

                if(isset($parametros['condicion_egreso_id']) && $parametros['condicion_egreso_id']){

                    $pacientes = $pacientes->where('A.condicion_egreso_id', $parametros['condicion_egreso_id']);

                }


                if(isset($parametros['estado_actual_id']) && $parametros['estado_actual_id']){

                    $pacientes = $pacientes->where('A.estado_actual_id', $parametros['estado_actual_id']);
                
                }

                if(isset($parametros['metodo_anticonceptivo_id']) && $parametros['metodo_anticonceptivo_id']){

                    $pacientes = $pacientes->where('A.metodo_anticonceptivo_id', $parametros['metodo_anticonceptivo_id']);
                
                }

                if(isset($parametros['fecha_inicio'], $parametros['fecha_fin'])){

                    //$pacientes = $pacientes->whereBetween('fecha_ingreso', [$parametros['fecha_inicio'], $parametros['fecha_fin']]);

                    $pacientes = $pacientes->whereBetween('A.fecha_alta', [$parametros['fecha_inicio'], $parametros['fecha_fin']])
                                           ->orderBy('A.fecha_alta', 'DESC');


                }

            }

            if(isset($parametros['page'])){
                $resultadosPorPagina = isset($parametros["per_page"])? $parametros["per_page"] : 20;
    
                $pacientes = $pacientes->paginate($resultadosPorPagina);
            } else {
                $pacientes = $pacientes->get();
            }


            return response()->json(['data'=>$pacientes, 'fecha_actual'=>$hoy],HttpResponse::HTTP_OK);

        }catch(\Throwable $e){
            return response()->json(['error'=>['message'=>$e->getMessage(),'line'=>$e->getLine()]], HttpResponse::HTTP_CONFLICT);
        }
        
    }
    

}
