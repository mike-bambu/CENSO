<?php

namespace App\Http\Controllers\API\Catalogos;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Models\Catalogos\MetodoAnticonceptivo;
use Illuminate\Http\Response as HttpResponse;
use Illuminate\Support\Facades\Input;
use Illuminate\Support\Facades\Hash;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Facades\DB;
use Response, Validator;

class MetodosAnticonceptivosController extends Controller
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

            $metodos_anticonceptivos = MetodoAnticonceptivo::orderBy('id');

            //Filtros, busquedas, ordenamiento
            if(isset($parametros['query']) && $parametros['query']){
                $metodos_anticonceptivos = $metodos_anticonceptivos->where(function($query)use($parametros){
                    return $query->where('nombre','LIKE','%'.$parametros['query'].'%');
                                //->orWhere('nombre','LIKE','%'.$parametros['query'].'%');
                });
            }

            if(isset($parametros['page'])){
                $resultadosPorPagina = isset($parametros["per_page"])? $parametros["per_page"] : 20;
    
                $metodos_anticonceptivos = $metodos_anticonceptivos->paginate($resultadosPorPagina);
            } else {
                $metodos_anticonceptivos = $metodos_anticonceptivos->get();
            }

            return response()->json(['catalogo_metodos_anticonceptivos'=>$metodos_anticonceptivos],HttpResponse::HTTP_OK);
        }catch(\Exception $e){
            return response()->json(['error'=>['message'=>$e->getMessage(),'line'=>$e->getLine()]], HttpResponse::HTTP_CONFLICT);
        }

    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        
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

        $inputs = $request->only('nombre');

        $v = Validator::make($inputs, $reglas, $mensajes);
        if ($v->fails()) {
            return Response::json(array($v->errors(), 409));
        }

        try {
            $metodos_anticonceptivos = MetodoAnticonceptivo::create($inputs);
            return response()->json(['catalogo_metodos_anticonceptivos'=>$metodos_anticonceptivos],HttpResponse::HTTP_OK);

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
        $metodos_anticonceptivos = MetodoAnticonceptivo::find($id);

        if(!$metodos_anticonceptivos){
            return response()->json(['No se encuentra el recurso que esta buscando.'], HttpResponse::HTTP_CONFLICT);
            //404
        }

        return response()->json(['catalogo_metodos_anticonceptivos' => $metodos_anticonceptivos], 200);
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
        $mensajes = [
            'required'      => "required",
            'unique'        => "unique"
        ];
        $reglas = [
            'nombre'        => 'required',
        ];

        $inputs = $request->only('nombre');
        $v = Validator::make($inputs, $reglas, $mensajes);
        if ($v->fails()) {
            return Response::json(array($v->errors(), 409));
        }

        try {
            $metodos_anticonceptivos = MetodoAnticonceptivo::find($id);
            $metodos_anticonceptivos->nombre =  $inputs['nombre'];
            $metodos_anticonceptivos->save();

            return response()->json(['catalogo_metodos_anticonceptivos'=>$metodos_anticonceptivos],HttpResponse::HTTP_OK);
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
            
            $metodos_anticonceptivos = MetodoAnticonceptivo::destroy($id);
            return response()->json(['catalogo_metodos_anticonceptivos'=>$id],HttpResponse::HTTP_OK);
        } catch (Exception $e) {
            return response()->json(['error'=>['message'=>$e->getMessage(),'line'=>$e->getLine()]], HttpResponse::HTTP_CONFLICT);
        }
    }
    }

