<?php

namespace App\Http\Controllers\API\Catalogos;

use Illuminate\Http\Request;
use Illuminate\Http\Response as HttpResponse;
use App\Http\Controllers\Controller;
//use Illuminate\Support\Facades\Input;
use Illuminate\Support\Facades\Hash;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Facades\DB;
use Response, Validator;
use App\Models\Catalogos\FactorCovid;

class FactoresCovidController extends Controller
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
            //$pacientes = Paciente::with('seguimientos')->get();

            $factores_covid = FactorCovid::orderBy('id');

            //Filtros, busquedas, ordenamiento
            if(isset($parametros['query']) && $parametros['query']){
                $factores_covid = $factores_covid->where(function($query)use($parametros){
                    return $query->where('nombre','LIKE','%'.$parametros['query'].'%');
                                //->orWhere('nombre','LIKE','%'.$parametros['query'].'%');
                });
            }

            if(isset($parametros['page'])){
                $resultadosPorPagina = isset($parametros["per_page"])? $parametros["per_page"] : 20;
    
                $factores_covid = $factores_covid->paginate($resultadosPorPagina);
            } else {
                $factores_covid = $factores_covid->get();
            }

            return response()->json(['catalogo_factores_covid'=>$factores_covid],HttpResponse::HTTP_OK);
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
        $mensajes = [
            'required'      => "required",
            'unique'        => "unique"
        ];
        $reglas = [
            'nombre'        => 'required',
        ];
        //$inputs = Input::only('nombre');
        $inputs = $request->only('nombre');
        $v = Validator::make($inputs, $reglas, $mensajes);
        if ($v->fails()) {
            return Response::json(array($v->errors(), 409));
        }

        try {
            $factor_covid = FactorCovid::create($inputs);
            return response()->json(['factor_covid'=>$factor_covid],HttpResponse::HTTP_OK);

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
        $factor_covid = FactorCovid::find($id);

        if(!$factor_covid){
            return response()->json(['No se encuentra el recurso que esta buscando.'], HttpResponse::HTTP_CONFLICT);
            //404
        }

        return response()->json(['factor_covid' => $factor_covid], 200);
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
        $inputs = $request->only('nombre');
        $v = Validator::make($inputs, $reglas, $mensajes);
        if ($v->fails()) {
            return Response::json(array($v->errors(), 409));
        }

        try {
            $factor_covid = FactorCovid::find($id);
            $factor_covid->nombre =  $inputs['nombre'];
            $factor_covid->save();

            return response()->json(['factor_covid'=>$factor_covid],HttpResponse::HTTP_OK);
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
            
            $factor_covid = FactorCovid::destroy($id);
            return response()->json(['factor_covid'=>$id],HttpResponse::HTTP_OK);
        } catch (Exception $e) {
            return response()->json(['error'=>['message'=>$e->getMessage(),'line'=>$e->getLine()]], HttpResponse::HTTP_CONFLICT);
        }
    }
    }
