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


class EmbarazosController extends Controller
{
    public function reporteEmbarazosEnHospitalizacion(Request $request)
    {

        $actual = Carbon::today()->toDateString();
        $hoy = Carbon::createFromDate($actual)->format('Y-m-d');
    
        $parametros = $request->all();
        $usuario = auth()->userOrFail();

        $servicios = array();
        foreach ($parametros['servicios'] as $key => $value) {

            $servicios[$key] = $value['id'];

        }
    
    
        try {



            if(isset($parametros['ver_servicios_todos']) && $parametros['ver_servicios_todos'] && $parametros['clues']){

                $pacientes = Paciente::select('pacientes.*')
                ->with('municipio', 'localidad', 'pais_origen', 'estado_republica', 'atenciones.seguimientos', 'ultimaAtencion.ultimoSeguimiento')
                ->join('atenciones as ATN', 'pacientes.id','=','ATN.paciente_id')
                ->where('sexo', '=', "Femenino")
                ->where('tieneAtencion', '=', 1)
                ->where('ATN.dadodeAlta', 0)
                ->where('ATN.estaEmbarazada', 1)
                ->where('ATN.clues_id', $parametros['clues'])
                ->orderBy('ATN.created_at', 'DESC')->latest();

            }else {

                $pacientes = Paciente::select('pacientes.*')
                ->with('municipio', 'localidad', 'pais_origen', 'estado_republica', 'atenciones.seguimientos', 'ultimaAtencion.ultimoSeguimiento')
                ->join('atenciones as ATN', 'pacientes.id','=','ATN.paciente_id')
                ->where('sexo', '=', "Femenino")
                ->where('tieneAtencion', '=', 1)
                ->whereIn('ATN.servicio_id', $servicios)
                ->where('ATN.dadodeAlta', 0)
                ->where('ATN.estaEmbarazada', 1)
                ->where('ATN.clues_id', $parametros['clues'])
                ->orderBy('ATN.created_at', 'DESC')->latest();

            }


            if(isset($parametros['query']) && $parametros['query']){
                $pacientes = $pacientes->where(function($query)use($parametros){
                    return $query->whereRaw('concat(pacientes.nombre," ", pacientes.paterno, " ", pacientes.materno) like "%'.$parametros['query'].'%"' )
                                ->orWhere('pacientes.folio_paciente','LIKE','%'.$parametros['query'].'%')
                                ->orWhere('pacientes.numero_expediente','LIKE','%'.$parametros['query'].'%')
                                ->orWhere('pacientes.alias','LIKE','%'.$parametros['query'].'%')
                                ->orWhere('pacientes.curp','LIKE','%'.$parametros['query'].'%')
                                ->orWhere('pacientes.nombre','LIKE','%'.$parametros['query'].'%')
                                ->orWhere('pacientes.paterno','LIKE','%'.$parametros['query'].'%')
                                ->orWhere('pacientes.materno','LIKE','%'.$parametros['query'].'%')
                                ->orWhere('pacientes.telefono_emergencia','LIKE','%'.$parametros['query'].'%')
                                ->orWhere('pacientes.telefono_celular','LIKE','%'.$parametros['query'].'%');
                });
            }

            if(isset($parametros['active_filter']) && $parametros['active_filter']){

                if(isset($parametros['numero_expediente']) && $parametros['numero_expediente']){

                    $pacientes = $pacientes->where('numero_expediente',$parametros['numero_expediente']);

                }


                if(isset($parametros['fecha_inicio'], $parametros['fecha_fin'])){

                    $pacientes = $pacientes->whereBetween(DB::raw('DATE(ATN.fecha_inicio_atencion)'), [$parametros['fecha_inicio'], $parametros['fecha_fin']]);

                }

                if(isset($parametros['servicios']) && $parametros['servicios']){

                    $pacientes = $pacientes->whereIn('ATN.servicio_id', $parametros['servicios']);

                }

                if(isset($parametros['numero_cama']) && $parametros['numero_cama']){

                    $pacientes = $pacientes->where('ATN.no_cama',$parametros['numero_cama']);

                }


                if(isset($parametros['estado_actual_id']) && $parametros['estado_actual_id']){

                    $pacientes = $pacientes->where('ATN.estado_actual_id',$parametros['estado_actual_id']);

                }


            }




            if(isset($parametros['page'])){
                $resultadosPorPagina = isset($parametros["per_page"])? $parametros["per_page"] : 20;

                $pacientes = $pacientes->paginate($resultadosPorPagina);
            } else {
                $pacientes = $pacientes->get();
            }

            return response()->json(['data'=>$pacientes, 'fecha_actual'=>$hoy],HttpResponse::HTTP_OK);

        } catch (\Throwable $e) {
            return response()->json(['error'=>['message'=>$e->getMessage(),'line'=>$e->getLine()]], HttpResponse::HTTP_CONFLICT);
        }

    }

    public function reporteEmbarazosAmbulatorios(Request $request)
    {

        $actual = Carbon::today()->toDateString();
        $hoy = Carbon::createFromDate($actual)->format('Y-m-d');
    
        $parametros = $request->all();
        $usuario = auth()->userOrFail();

        $servicios = array();
        foreach ($parametros['servicios'] as $key => $value) {

            $servicios[$key] = $value['id'];

        }
    
    
        try {



            if(isset($parametros['ver_servicios_todos']) && $parametros['ver_servicios_todos'] && $parametros['clues']){

                $pacientes = Paciente::select('pacientes.*')
                ->with('municipio', 'localidad', 'pais_origen', 'estado_republica', 'atenciones.seguimientos', 'atenciones.alta', 'ultimaAtencion.ultimoSeguimiento')
                ->leftjoin('atenciones as ATN', 'pacientes.id','=','ATN.paciente_id')
                ->leftjoin('altas      as ALT', 'ATN.id','=','ALT.atencion_id')
                ->where('sexo', '=', "Femenino")
                ->where('tieneAtencion', '=', 0)
                ->where('ATN.dadodeAlta', 0)
                ->where('ATN.esAmbulatoria', 1)
                ->where('ATN.estaEmbarazada', 1)
                ->where('ATN.clues_id', $parametros['clues'])
                ->orderBy('ATN.created_at', 'DESC')->latest();

            }else {

                $pacientes = Paciente::select('pacientes.*')
                ->with('municipio', 'localidad', 'pais_origen', 'estado_republica', 'atenciones.seguimientos', 'atenciones.alta', 'ultimaAtencion.ultimoSeguimiento')
                ->leftjoin('atenciones as ATN', 'pacientes.id','=','ATN.paciente_id')
                ->leftjoin('altas      as ALT', 'ATN.id','=','ALT.atencion_id')
                ->where('sexo', '=', "Femenino")
                ->where('tieneAtencion', '=', 0)
                ->whereIn('ATN.servicio_id', $servicios)
                ->where('ATN.dadodeAlta', 0)
                ->where('ATN.esAmbulatoria', 1)
                ->where('ATN.estaEmbarazada', 1)
                ->where('ATN.clues_id', $parametros['clues'])
                ->orderBy('ATN.created_at', 'DESC')->latest();

            }


            if(isset($parametros['query']) && $parametros['query']){
                $pacientes = $pacientes->where(function($query)use($parametros){
                    return $query->whereRaw('concat(pacientes.nombre," ", pacientes.paterno, " ", pacientes.materno) like "%'.$parametros['query'].'%"' )
                                ->orWhere('pacientes.folio_paciente','LIKE','%'.$parametros['query'].'%')
                                ->orWhere('pacientes.numero_expediente','LIKE','%'.$parametros['query'].'%')
                                ->orWhere('pacientes.alias','LIKE','%'.$parametros['query'].'%')
                                ->orWhere('pacientes.curp','LIKE','%'.$parametros['query'].'%')
                                ->orWhere('pacientes.nombre','LIKE','%'.$parametros['query'].'%')
                                ->orWhere('pacientes.paterno','LIKE','%'.$parametros['query'].'%')
                                ->orWhere('pacientes.materno','LIKE','%'.$parametros['query'].'%')
                                ->orWhere('pacientes.telefono_emergencia','LIKE','%'.$parametros['query'].'%')
                                ->orWhere('pacientes.telefono_celular','LIKE','%'.$parametros['query'].'%');
                });
            }

            if(isset($parametros['active_filter']) && $parametros['active_filter']){

                if(isset($parametros['numero_expediente']) && $parametros['numero_expediente']){

                    $pacientes = $pacientes->where('numero_expediente',$parametros['numero_expediente']);

                }


                if(isset($parametros['fecha_inicio'], $parametros['fecha_fin'])){

                    $pacientes = $pacientes->whereBetween(DB::raw('DATE(ATN.fecha_inicio_atencion)'), [$parametros['fecha_inicio'], $parametros['fecha_fin']]);

                }

                if(isset($parametros['servicios']) && $parametros['servicios']){

                    $pacientes = $pacientes->whereIn('ATN.servicio_id', $parametros['servicios']);

                }

                if(isset($parametros['numero_cama']) && $parametros['numero_cama']){

                    $pacientes = $pacientes->where('ATN.no_cama',$parametros['numero_cama']);

                }


                if(isset($parametros['estado_actual_id']) && $parametros['estado_actual_id']){

                    $pacientes = $pacientes->where('ALT.estado_actual_id',$parametros['estado_actual_id']);

                }

                if(isset($parametros['motivo_egreso_id']) && $parametros['motivo_egreso_id']){

                    $pacientes = $pacientes->where('ALT.motivo_egreso_id',$parametros['motivo_egreso_id']);

                }

                if(isset($parametros['condicion_egreso_id']) && $parametros['condicion_egreso_id']){

                    $pacientes = $pacientes->where('ALT.condicion_egreso_id',$parametros['condicion_egreso_id']);

                }

                // if(isset($parametros['estado_salud_egreso']) && $parametros['estado_salud_egreso']){

                //     $pacientes = $pacientes->where('ALT.estado_actual_id',$parametros['estado_salud_egreso']);

                // }

                if(isset($parametros['metodo_anticonceptivo_id']) && $parametros['metodo_anticonceptivo_id']){

                    $pacientes = $pacientes->where('ALT.metodo_anticonceptivo_id',$parametros['metodo_anticonceptivo_id']);

                }
                


            }




            if(isset($parametros['page'])){
                $resultadosPorPagina = isset($parametros["per_page"])? $parametros["per_page"] : 20;

                $pacientes = $pacientes->paginate($resultadosPorPagina);
            } else {
                $pacientes = $pacientes->get();
            }

            return response()->json(['data'=>$pacientes, 'fecha_actual'=>$hoy],HttpResponse::HTTP_OK);

        } catch (\Throwable $e) {
            return response()->json(['error'=>['message'=>$e->getMessage(),'line'=>$e->getLine()]], HttpResponse::HTTP_CONFLICT);
        }

    }

}