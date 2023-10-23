<?php

namespace App\Http\Controllers\API\Busquedas;

use Illuminate\Http\Request;
use Illuminate\Http\Response as HttpResponse;
use App\Http\Controllers\Controller;

use App\Models\Catalogos\Clue;
use App\Models\Catalogos\Distrito;
//use App\Models\Sistema\Diagnostico;
use App\Models\Catalogos\Pais;
use App\Models\Catalogos\Municipio;
use App\Models\Catalogos\Localidad;
use App\Models\Catalogos\EstadoActual;
use App\Models\Sistema\Paciente;


class BusquedaRecursosController extends Controller
{
    public function getCluesAutocomplete(Request $request) {
        /*if (\Gate::denies('has-permission', \Permissions::VER_ROL) && \Gate::denies('has-permission', \Permissions::SELECCIONAR_ROL)){
            return response()->json(['message'=>'No esta autorizado para ver este contenido'],HttpResponse::HTTP_FORBIDDEN);
        }*/

        try{
            $parametros = $request->all();
            $unidades = Clue::select('id', 'nombre', 'domicilio', 'codigoPostal', 'nivelAtencion', 'numeroLatitud', 'numeroLongitud');
            
            //Filtros, busquedas, ordenamiento
            if(isset($parametros['query']) && $parametros['query']){
                $unidades = $unidades->where(function($query)use($parametros){
                    return $query->where('nombre','LIKE','%'.$parametros['query'].'%')
                                ->orWhere('id','LIKE','%'.$parametros['query'].'%');
                });
            }

            if(isset($parametros['page'])){
                $resultadosPorPagina = isset($parametros["per_page"])? $parametros["per_page"] : 20;
                $unidades = $unidades->paginate($resultadosPorPagina);
            } else {

                $unidades = $unidades->get();
            }

            return response()->json(['data'=>$unidades],HttpResponse::HTTP_OK);
        }catch(\Exception $e){
            return response()->json(['error'=>['message'=>$e->getMessage(),'line'=>$e->getLine()]], HttpResponse::HTTP_CONFLICT);
        }
    }

    public function busquedaPacientes(Request $request)
    {
        try {

            $pacientes = "";

            $parametros = $request->all();

            // if(isset($parametros['query']) && $parametros['query']){
            //     $pacientes = $pacientes->where(function($query)use($parametros){
            //         return $query->where('nombre','LIKE','%'.$parametros['query'].'%')
            //                     ->orWhere('paterno','LIKE','%'.$parametros['query'].'%')
            //                     ->orWhere('materno','LIKE','%'.$parametros['query'].'%');
            //     });
            // }

            if(isset($parametros['active_filter']) && $parametros['active_filter']){

                $pacientes = Paciente::select('pacientes.*');

                if(isset($parametros['nombre']) && $parametros['nombre']){

                    $pacientes = $pacientes->where('nombre','LIKE','%'.$parametros['nombre'].'%');
    
                }
                if(isset($parametros['paterno']) && $parametros['paterno']){

                    $pacientes = $pacientes->where('paterno','LIKE','%'.$parametros['paterno'].'%');
    
                }
                if(isset($parametros['materno']) && $parametros['materno']){

                    $pacientes = $pacientes->where('materno','LIKE','%'.$parametros['materno'].'%');
    
                }
                if(isset($parametros['curp']) && $parametros['curp']){

                    $pacientes = $pacientes->where('curp','LIKE','%'.$parametros['curp'].'%');
    
                }

            }

            $pacientes = $pacientes != "" ? $pacientes->get() : $pacientes = Array();

            return response()->json(['data' => $pacientes], HttpResponse::HTTP_OK);
        } catch (\Exception $e) {
            return response()->json(['error' => ['message' => $e->getMessage(), 'line' => $e->getLine()]], HttpResponse::HTTP_CONFLICT);
        }
    }

    public function infoPaciente($id){
        try{
            
            //$params = $request->all();

            $paciente = Paciente::with('municipio', 'localidad', 'pais_origen', 'atenciones', 'ultimaAtencion.ultimoSeguimiento', 'embarazo')->where('id',$id)->orderBy('created_at', 'DESC')->first();

            if(!$paciente){
                throw new Exception("No se encontro al paciente buscado", 1);
            }
            
            return response()->json(['data'=>$paciente],HttpResponse::HTTP_OK);
        }catch(\Exception $e){
            return response()->json(['error'=>['message'=>$e->getMessage(),'line'=>$e->getLine()]], HttpResponse::HTTP_CONFLICT);
        }
    }

    public function infoPacienteEgreso($id){
        try{
            
            //$params = $request->all();

            $paciente = Paciente::with('municipio', 'localidad', 'pais_origen', 'ultimaAtencionAlta.alta', 'embarazo')->where('id',$id)->orderBy('created_at', 'DESC')->first();

            if(!$paciente){
                throw new Exception("No se encontro al paciente buscado", 1);
            }
            
            return response()->json(['data'=>$paciente],HttpResponse::HTTP_OK);
        }catch(\Exception $e){
            return response()->json(['error'=>['message'=>$e->getMessage(),'line'=>$e->getLine()]], HttpResponse::HTTP_CONFLICT);
        }
    }
}
