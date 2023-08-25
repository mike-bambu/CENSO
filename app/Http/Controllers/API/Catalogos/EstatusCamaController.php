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

use App\Models\Catalogos\EstatusCama;

class EstatusCamaController extends Controller
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

            $estatus_cama = EstatusCama::getModel();

            //Filtros, busquedas, ordenamiento
            if(isset($parametros['query']) && $parametros['query']){
                $estatus_cama = $estatus_cama->where(function($query)use($parametros){
                    return $query->where('nombre','LIKE','%'.$parametros['query'].'%');
                                //->orWhere('nombre','LIKE','%'.$parametros['query'].'%');
                });
            }

            if(isset($parametros['page'])){
                $resultadosPorPagina = isset($parametros["per_page"])? $parametros["per_page"] : 20;
    
                $estatus_cama = $estatus_cama->paginate($resultadosPorPagina);
            } else {
                $estatus_cama = $estatus_cama->get();
            }

            return response()->json(['catalogo_estatus_cama'=>$estatus_cama],HttpResponse::HTTP_OK);
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
        $estatus = new EstatusCama();

        $mensajes = [
            'required'      => "required",
            'unique'        => "unique"
        ];
        $reglas = [
            'nombre'        => 'required',
        ];

        $estatus->nombre   = $datos['nombre'];
        $estatus->descripcion = $datos['descripcion'];

        $v = Validator::make($inputs, $reglas, $mensajes);
        
        if ($v->fails()) {
            return Response::json(array($v->errors(), 409));
        }

        try {
            $estatus = EstatusCama::create($datos);
            
            return response()->json(['estatus_cama'=>$estatus],HttpResponse::HTTP_OK);

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
        $estatus = EstatusCama::find($id);

        if(!$estatus){
            return response()->json(['No se encuentra el recurso que esta buscando.'], HttpResponse::HTTP_CONFLICT);
            //404
        }

        return response()->json(['estatus_cama' => $estatus], 200);
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
        $mensajes = [

            'required'      => "required",
            'unique'        => "unique"
        ];

        $reglas = [
            'nombre'        => 'required',
        ];

        //$inputs = Input::only('nombre');
        $datos = $request->all();
        $estatus = new EstatusCama();

        $v = Validator::make($inputs, $reglas, $mensajes);
        

        if ($v->fails()) {

            return Response::json(array($v->errors(), 409));
        }

        try {
            $estatus = EstatusCama::find($id);
            $estatus->nombre   = $datos['nombre'];
            $estatus->descripcion = $datos['descripcion'];

            $estatus->save();

            return response()->json(['estatus_cama'=>$estatus],HttpResponse::HTTP_OK);

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
            
            $servicio = EstatusCama::destroy($id);

            return response()->json(['estatus_cama'=>$id],HttpResponse::HTTP_OK);
        } catch (Exception $e) {
            return response()->json(['error'=>['message'=>$e->getMessage(),'line'=>$e->getLine()]], HttpResponse::HTTP_CONFLICT);
        }
    }
}
