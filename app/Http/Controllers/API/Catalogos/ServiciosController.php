<?php

namespace App\Http\Controllers\API\Catalogos;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Http\Response as HttpResponse;
//use Illuminate\Support\Facades\Input;
use Illuminate\Support\Facades\Hash;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Facades\DB;
use Response, Validator;

use App\Models\Catalogos\Servicio;

class ServiciosController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {

        try{

            //$parametros = Input::all();
            $parametros = $request->all();

            //$servicios = Servicio::orderBy('id')->with('clues');
            //SI NO TRAE CLUES MOSTRAR TODOS LOS SERVICIOS

            if(isset($parametros['clues'], $parametros['clues'])){

                $servicios = Servicio::select('servicios.*')->with('clues')
                ->where('clues_id', $parametros['clues'])
                ->orderBy('id');
                
            }else{
                $servicios = Servicio::orderBy('id')->with('clues');
            }

            //Filtros, busquedas, ordenamiento
            if(isset($parametros['query']) && $parametros['query']){
                $servicios = $servicios->where(function($query)use($parametros){
                    return $query->where('nombre','LIKE','%'.$parametros['query'].'%');
                                //->orWhere('nombre','LIKE','%'.$parametros['query'].'%');
                });
            }

            if(isset($parametros['page'])){
                $resultadosPorPagina = isset($parametros["per_page"])? $parametros["per_page"] : 20;
    
                $servicios = $servicios->paginate($resultadosPorPagina);
            } else {
                $servicios = $servicios->get();
            }

            return response()->json(['catalogo_servicios'=>$servicios],HttpResponse::HTTP_OK);
        }catch(\Exception $e){
            return response()->json(['error'=>['message'=>$e->getMessage(),'line'=>$e->getLine()]], HttpResponse::HTTP_CONFLICT);
        }
    }
    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $datos = $request->all();
        $servicio = new Servicio();

        $reglas = [
            'nombre'            => 'required:servicios',
            'es_ambulatorio'    => 'required:servicios',
            'clues_id'          => 'required:servicios',
        ];

        $mensajes = [

            'nombre.required'           => 'El nombre del servicio es Obligatorio',
            'es_ambulatorio.required'   => 'El servicio Ambulatorio es Obligatorio',
            'clues_id.required'         => 'La clues es Obligatoria',
        ];

        $servicio->nombre           = $datos['nombre'];
        $servicio->es_ambulatorio   = $datos['es_ambulatorio'];
        $servicio->clues_id         = $datos['clues_id'];

        $v = Validator::make($datos, $reglas, $mensajes);
        
        if ($v->fails()) {
            return Response::json(array($v->errors(), 409));
        }

        try {
            $servicio = Servicio::create($datos);
            
            return response()->json(['servicio'=>$servicio],HttpResponse::HTTP_OK);

        } catch (\Exception $e) {
            return response()->json(['error'=>['message'=>$e->getMessage(),'line'=>$e->getLine()]], HttpResponse::HTTP_CONFLICT);
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
        $servicio = Servicio::find($id);

        if(!$servicio){
            return response()->json(['No se encuentra el recurso que esta buscando.'], HttpResponse::HTTP_CONFLICT);
            //404
        }

        return response()->json(['servicio' => $servicio], 200);
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

        $datos = $request->all();

        $reglas = [
            'nombre'            => 'required:servicios',
            'es_ambulatorio'    => 'required:servicios',
            'clues_id'          => 'required:servicios',
        ];

        $mensajes = [

            'nombre.required'           => 'El nombre del servicio es Obligatorio',
            'es_ambulatorio.required'   => 'El servicio Ambulatorio es Obligatorio',
            'clues_id.required'         => 'La clues es Obligatoria',
        ];

        //$inputs = Input::only('nombre');
        $servicio = new Servicio();

        $v = Validator::make($datos, $reglas, $mensajes);
        

        if ($v->fails()) {

            return Response::json(array($v->errors(), 409));
        }

        try {
            $servicio = Servicio::find($id);
            $servicio->nombre           = $datos['nombre'];
            $servicio->es_ambulatorio   = $datos['es_ambulatorio'];
            $servicio->clues_id         = $datos['clues_id'];

            $servicio->save();

            return response()->json(['servicio'=>$servicio],HttpResponse::HTTP_OK);

        } catch (\Exception $e) {
            return $this->respuestaError($e->getMessage(), 409);
        }
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        try {
            
            $servicio = Servicio::destroy($id);

            return response()->json(['servicio'=>$id],HttpResponse::HTTP_OK);
        } catch (Exception $e) {
            return response()->json(['error'=>['message'=>$e->getMessage(),'line'=>$e->getLine()]], HttpResponse::HTTP_CONFLICT);
        }
    }
}
