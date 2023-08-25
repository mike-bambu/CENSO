<?php

namespace App\Http\Controllers\API\Busquedas;

use Illuminate\Http\Request;
use Illuminate\Http\Response as HttpResponse;
use App\Http\Controllers\Controller;

use App\Models\Catalogos\Clue;
use App\Models\Catalogos\Distrito;
use App\Models\Sistema\Diagnostico;
use App\Models\Catalogos\Pais;
use App\Models\Catalogos\EstadosRepublica;
use App\Models\Catalogos\Municipio;
use App\Models\Catalogos\Localidad;
use App\Models\Catalogos\EstadoActual;
use App\Models\Catalogos\Servicio;
use App\Models\Catalogos\EstatusCama;
use App\Models\Catalogos\Especialidad;
use App\Models\Catalogos\FactorCovid;
use App\Models\Catalogos\MotivoEgreso;
use App\Models\Catalogos\Camas;
use App\Models\Catalogos\MetodoAnticonceptivo;
use App\Models\Catalogos\MetodoGestacional;
use App\Models\Catalogos\CondicionEgreso;



class BusquedaCatalogosController extends Controller
{
    public function getCluesAutocomplete(Request $request)
    {
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

    public function getDistritosAutocomplete(Request $request)
    {
        /*if (\Gate::denies('has-permission', \Permissions::VER_ROL) && \Gate::denies('has-permission', \Permissions::SELECCIONAR_ROL)){
            return response()->json(['message'=>'No esta autorizado para ver este contenido'],HttpResponse::HTTP_FORBIDDEN);
        }*/

        try{
            $parametros = $request->all();
            $distritos = Distrito::select('distritos.*');
            
            //Filtros, busquedas, ordenamiento
            if(isset($parametros['query']) && $parametros['query']){
                $distritos = $distritos->where(function($query)use($parametros){
                    return $query->where('nombre','LIKE','%'.$parametros['query'].'%')
                                ->orWhere('id','LIKE','%'.$parametros['query'].'%');
                });
            }

            if(isset($parametros['page'])){
                $resultadosPorPagina = isset($parametros["per_page"])? $parametros["per_page"] : 20;
                $distritos = $distritos->paginate($resultadosPorPagina);
            } else {

                $distritos = $distritos->get();
            }

            return response()->json(['data'=>$distritos],HttpResponse::HTTP_OK);
        }catch(\Exception $e){
            return response()->json(['error'=>['message'=>$e->getMessage(),'line'=>$e->getLine()]], HttpResponse::HTTP_CONFLICT);
        }
    }

    public function getDiagnosticosAutocomplete(Request $request)
    {
        /*if (\Gate::denies('has-permission', \Permissions::VER_ROL) && \Gate::denies('has-permission', \Permissions::SELECCIONAR_ROL)){
            return response()->json(['message'=>'No esta autorizado para ver este contenido'],HttpResponse::HTTP_FORBIDDEN);
        }*/

        try{
            $parametros = $request->all();
            $unidades = Diagnostico::select('id','nombre');
            
            //Filtros, busquedas, ordenamiento
            if(isset($parametros['query']) && $parametros['query']){
                $unidades = $unidades->where(function($query)use($parametros){
                    return $query->where('nombre','LIKE','%'.$parametros['query'].'%');
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


    public function getCServiciosAutocomplete(Request $request)
    {
        /*if (\Gate::denies('has-permission', \Permissions::VER_ROL) && \Gate::denies('has-permission', \Permissions::SELECCIONAR_ROL)){
            return response()->json(['message'=>'No esta autorizado para ver este contenido'],HttpResponse::HTTP_FORBIDDEN);
        }*/

        try{
            $parametros = $request->all();

            //$servicios = Servicio::select('id', 'nombre');

            //SI NO TRAE CLUES MOSTRAR TODOS LOS SERVICIOS

            if(isset($parametros['clues'], $parametros['clues'])){

                $servicios = Servicio::select('id', 'nombre')
                ->where('clues_id', $parametros['clues'])
                ->orderBy('id');
                
            }else{
                $servicios = Servicio::select('id', 'nombre');
            }
            
            //Filtros, busquedas, ordenamiento
            if(isset($parametros['query']) && $parametros['query']){
                $servicios = $servicios->where(function($query)use($parametros){
                    return $query->where('nombre','LIKE','%'.$parametros['query'].'%')
                                ->orWhere('id','LIKE','%'.$parametros['query'].'%');
                });
            }

            if(isset($parametros['page'])){
                $resultadosPorPagina = isset($parametros["per_page"])? $parametros["per_page"] : 20;
                $servicios = $servicios->paginate($resultadosPorPagina);
            } else {

                $servicios = $servicios->get();
            }

            return response()->json(['data'=>$servicios],HttpResponse::HTTP_OK);
        }catch(\Exception $e){
            return response()->json(['error'=>['message'=>$e->getMessage(),'line'=>$e->getLine()]], HttpResponse::HTTP_CONFLICT);
        }
    }


    public function getCatalogs(Request $request)
    {
        try {
            $listado_catalogos = [
                
                'clues'                     => Clue::getModel(),
                'diagnosticos'              => Diagnostico::getModel(),
                'distritos'                 => Distrito::getModel(),
                'paises'                    => Pais::getModel(),
                'estados_republica'         => EstadosRepublica::getModel(),
                'municipios'                => Municipio::getModel(),
                'localidades'               => Localidad::getModel(),
                'estados_actuales'          => EstadoActual::getModel(),
                'servicios'                 => Servicio::getModel(),
                'camas'                     => Camas::getModel(),
                'estatus_cama'              => EstatusCama::getModel(),
                'especialidades'            => Especialidad::getModel(),
                'factor_covid'              => FactorCovid::getModel(),
                'motivos_egresos'           => MotivoEgreso::getModel(),
                'metodos_anticonceptivos'   => MetodoAnticonceptivo::getModel(),
                'metodos_gestacionales'     => MetodoGestacional::getModel(),
                'condiciones_egreso'        => CondicionEgreso::getModel(),


            ];

            //$parametros = Input::all();
            $parametros = $request->all();

            $catalogos = [];
            for ($i = 0; $i < count($parametros); $i++) {
                $catalogo = $parametros[$i]; //podemos agregar filtros y ordenamiento

                if (isset($listado_catalogos[$catalogo['nombre']])) {
                    $modelo = $listado_catalogos[$catalogo['nombre']];
                    //podemos agregar filtros y ordenamiento
                    if (isset($catalogo['orden']) && $catalogo['orden']) { //hacer arrays
                        $modelo = $modelo->orderBy($catalogo['orden']);
                    }
                    //throw new \Exception(isset($catalogo['filtro_id']), 1);
                    if (isset($catalogo['filtro_id']) && $catalogo['filtro_id']) {  //hacer arrays

                        $modelo = $modelo->where($catalogo['filtro_id']['campo'], $catalogo['filtro_id']['valor']);
                    }

                    if (isset($catalogo['filtro_secundario_id']) && $catalogo['filtro_secundario_id']) {  //hacer arrays

                        $modelo = $modelo->where($catalogo['filtro_secundario_id']['campo'], $catalogo['filtro_secundario_id']['valor']);
                    }

                    $catalogos[$catalogo['nombre']] = $modelo->get(); //por el momento bastara con esto
                } else {
                    $catalogos[$catalogo['nombre']] = '404';
                }
            }

            return response()->json(['data' => $catalogos], HttpResponse::HTTP_OK);
        } catch (\Exception $e) {
            return response()->json(['error' => ['message' => $e->getMessage(), 'line' => $e->getLine()]], HttpResponse::HTTP_CONFLICT);
        }
    }
}
