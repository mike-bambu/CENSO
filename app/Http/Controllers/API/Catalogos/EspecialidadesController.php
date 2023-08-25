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
use App\Models\Catalogos\Especialidad;

class EspecialidadesController extends Controller
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

            if(isset($parametros['clues'], $parametros['clues'])){

                $especialidades = Especialidad::select('especialidades.*')->with('clues')
                ->where('clues_id', $parametros['clues'])
                ->orderBy('id');
                
            }else{
                $especialidades = Especialidad::orderBy('id')->with('clues');
            }

            

            //Filtros, busquedas, ordenamiento
            if(isset($parametros['query']) && $parametros['query']){
                $especialidades = $especialidades->where(function($query)use($parametros){
                    return $query->where('nombre','LIKE','%'.$parametros['query'].'%');
                                //->orWhere('nombre','LIKE','%'.$parametros['query'].'%');
                });
            }

            if(isset($parametros['page'])){
                $resultadosPorPagina = isset($parametros["per_page"])? $parametros["per_page"] : 20;
    
                $especialidades = $especialidades->paginate($resultadosPorPagina);
            } else {
                $especialidades = $especialidades->get();
            }

            return response()->json(['catalogo_especialidades'=>$especialidades],HttpResponse::HTTP_OK);
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
            $especialidad = Especialidad::create($inputs);
            return response()->json(['especialidad'=>$especialidad],HttpResponse::HTTP_OK);

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
        $especialidad = Especialidad::find($id);

        if(!$especialidad){
            return response()->json(['No se encuentra el recurso que esta buscando.'], HttpResponse::HTTP_CONFLICT);
            //404
        }

        return response()->json(['especialidad' => $especialidad], 200);
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
            $especialidad = Especialidad::find($id);
            $especialidad->nombre =  $inputs['nombre'];
            $especialidad->save();

            return response()->json(['especialidad'=>$especialidad],HttpResponse::HTTP_OK);
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
            
            $especialidad = Especialidad::destroy($id);
            return response()->json(['especialidad'=>$id],HttpResponse::HTTP_OK);
        } catch (Exception $e) {
            return response()->json(['error'=>['message'=>$e->getMessage(),'line'=>$e->getLine()]], HttpResponse::HTTP_CONFLICT);
        }
    }
    }
