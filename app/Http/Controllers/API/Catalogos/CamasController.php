<?php

namespace App\Http\Controllers\API\Catalogos;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Http\Response as HttpResponse;
use Illuminate\Support\Facades\DB;
use Response, Validator;

use App\Models\Catalogos\Camas;

class CamasController extends Controller
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
            // $parametros = $request->all();
            // //$pacientes = Paciente::with('seguimientos')->get();

            // if(isset($parametros['clues'], $parametros['clues'])){

            //     $camas = Camas::select('camas.*')->with('servicio', 'clues', 'estatus_cama')
            //     ->where('clues_id', $parametros['clues'])
            //     ->orderBy('id');
                
            // }else{
            //     $camas = Camas::orderBy('id')->with('servicio', 'clues', 'estatus_cama');
            // }
            $loggedUser = auth()->userOrFail();
            $userServicio = '';

            $permiso = DB::table('permissions')
                ->leftJoin('permission_user', 'permissions.id', '=', 'permission_user.permission_id')
                ->where('permission_user.user_id', '=', $loggedUser->id)
                ->where('permission_user.permission_id', '=', 'OFqzXg3CmjTUVLQ8IFuy3QYriN3cNruc')
                ->first();

            $userServicio = DB::table('servicio_user')
            ->where('user_id', $loggedUser->id)->first();

            //$parametros = Input::all();
            $parametros = $request->all();
            //$pacientes = Paciente::with('seguimientos')->get();

            if($permiso){

                $camas = Camas::select('camas.*')->with('servicio', 'clues', 'estatus_cama')
                ->where('clues_id', $parametros['clues'])
                ->orderBy('servicio_id');
                
            } elseif($userServicio){

                $camas = Camas::select('camas.*')->with('servicio', 'clues', 'estatus_cama')
                ->where('clues_id', $parametros['clues'])
                ->where('servicio_id', $userServicio->servicio_id)
                ->orderBy('servicio_id');
            }
            

            //Filtros, busquedas, ordenamiento
            if(isset($parametros['query']) && $parametros['query']){
                $camas = $camas->where(function($query)use($parametros){
                    return $query->where('numero','LIKE','%'.$parametros['query'].'%')
                                 ->orWhere('folio','LIKE','%'.$parametros['query'].'%');
                });
            }

            if(isset($parametros['active_filter']) && $parametros['active_filter']){
                

                if(isset($parametros['numero']) && $parametros['numero']){

                    //$camas = $camas->where('numero',$parametros['numero']);
                    $camas = $camas->where('numero','LIKE','%'.$parametros['numero'].'%');

                }

                if(isset($parametros['tipo_cama']) && $parametros['tipo_cama']){

                    $camas = $camas->where('tipo_cama',$parametros['tipo_cama']);

                }

                if(isset($parametros['servicio_id']) && $parametros['servicio_id']){

                    $camas = $camas->where('servicio_id',$parametros['servicio_id']);

                }

                if(isset($parametros['estatus_cama_id']) && $parametros['estatus_cama_id']){

                    $camas = $camas->where('estatus_cama_id',$parametros['estatus_cama_id']);

                }


            }

            if(isset($parametros['page'])){
                $resultadosPorPagina = isset($parametros["per_page"])? $parametros["per_page"] : 20;
    
                $camas = $camas->paginate($resultadosPorPagina);
            } else {
                $camas = $camas->get();
            }

            return response()->json(['catalogo_camas'=>$camas],HttpResponse::HTTP_OK);
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
        $camas = new Camas();

        $mensajes = [
            'required'      => "required",
            'unique'        => "unique"
        ];
        $reglas = [
            'numero'                    => 'required',
            'descripcion'               => 'required',
            'tipo_cama'                 => 'required',
            'clues_id'                  => 'required',
            'servicio_id'               => 'required',
            'estatus_cama_id'           => 'required',
        ];

        $camas->numero              = $datos['numero'];
        $camas->folio               = $datos['folio'];
        $camas->descripcion         = $datos['descripcion'];
        $camas->tipo_cama           = $datos['tipo_cama'];
        $camas->clues_id            = $datos['clues_id'];
        $camas->servicio_id         = $datos['servicio_id'];
        $camas->estatus_cama_id     = $datos['estatus_cama_id'];

        $v = Validator::make($datos, $reglas, $mensajes);
        
        if ($v->fails()) {
            return Response::json(array($v->errors(), 409));
        }

        try {
            $camas = Camas::create($datos);
            
            return response()->json(['catalogo_camas'=>$camas],HttpResponse::HTTP_OK);

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
        $cama = Camas::with('servicio', 'estatus_cama', 'clues')->find($id);

        if(!$cama){
            return response()->json(['No se encuentra el recurso que esta buscando.'], HttpResponse::HTTP_CONFLICT);
            //404
        }

        return response()->json(['catalogo_camas' => $cama], 200);
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
            'numero'                    => 'required',
            'descripcion'               => 'required',
            'tipo_cama'                 => 'required',
            'servicio_id'               => 'required',
            'estatus_cama_id'           => 'required',
            'clues_id'                  => 'required',
        ];

        //$inputs = Input::only('nombre');
        $datos = $request->all();

        $v = Validator::make($datos, $reglas, $mensajes);
        

        if ($v->fails()) {

            return Response::json(array($v->errors(), 409));
        }

        try {
            $camas = Camas::find($id);

            $camas->numero              = $datos['numero'];
            $camas->folio               = $datos['folio'];
            $camas->descripcion         = $datos['descripcion'];
            $camas->tipo_cama           = $datos['tipo_cama'];
            $camas->clues_id            = $datos['clues_id'];
            $camas->servicio_id         = $datos['servicio_id'];
            $camas->estatus_cama_id     = $datos['estatus_cama_id'];

            $camas->save();

            return response()->json(['catalogo_camas'=>$camas],HttpResponse::HTTP_OK);

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
            
            $camas = Camas::destroy($id);

            return response()->json(['cama'=>$id],HttpResponse::HTTP_OK);
        } catch (Exception $e) {
            return response()->json(['error'=>['message'=>$e->getMessage(),'line'=>$e->getLine()]], HttpResponse::HTTP_CONFLICT);
        }
    }

    public function resumenCamasEstatus(Request $request)
    {

        try {

            $datos = $request->all();

            $total_ambulatorias = Camas::select('servicios.id as servicio_id','servicios.nombre as nombre_servicio', DB::raw('count(estatus_cama.id) as total_camas_por_estatus'))
                                            ->join('servicios',     'camas.servicio_id',    '=', 'servicios.id')
                                            ->join('estatus_cama',  'camas.estatus_cama_id','=',  'estatus_cama.id')
                                            ->where('servicios.es_ambulatorio', '=', 1)
                                            ->where('servicios.clues_id', '=', $datos['clues'])
                                            ->where('camas.clues_id', '=', $datos['clues'])
                                            ->whereNotIn('camas.estatus_cama_id',[1])
                                            ->groupBy('servicios.id', 'servicios.nombre')
                                            ->orderBy('camas.id')
                                            ->get();


            $total_estatus_camas_ambulatorias = Camas::select('servicios.id as servicio_id','servicios.nombre as nombre_servicio', 'estatus_cama.nombre as nombre_estatus', DB::raw('count(estatus_cama.id) as total_camas_por_estatus'))
                                    ->join('servicios',     'camas.servicio_id',    '=', 'servicios.id')
                                    ->join('estatus_cama',  'camas.estatus_cama_id','=',  'estatus_cama.id')
                                    ->where('servicios.es_ambulatorio', '=', 1)
                                    ->where('servicios.clues_id', '=', $datos['clues'])
                                    ->where('camas.clues_id', '=', $datos['clues'])
                                    ->whereNotIn('camas.estatus_cama_id',[1])
                                    ->groupBy('servicios.id','estatus_cama.nombre', 'servicios.nombre')
                                    ->orderBy('camas.id')
                                    ->get();



            $total_camas_ambulatorias = Camas::select('servicios.id as servicio_id','servicios.nombre as nombre_servicio', DB::raw('count(servicios.nombre) as total_camas'))
                                ->join('servicios',     'camas.servicio_id',    '=', 'servicios.id')
                                ->join('estatus_cama',  'camas.estatus_cama_id','=',  'estatus_cama.id')
                                ->where('servicios.es_ambulatorio', '=', 1)
                                ->where('servicios.clues_id', '=', $datos['clues'])
                                ->where('camas.clues_id', '=', $datos['clues'])
                                // ->whereNotIn('camas.estatus_cama_id',[1])
                                ->groupBy('servicios.nombre', 'servicios.id')
                                ->orderBy('camas.id')
                                ->get();



            $total_estatus_camas = Camas::select('servicios.id as servicio_id','servicios.nombre as nombre_servicio', 'estatus_cama.nombre as nombre_estatus', DB::raw('count(servicios.nombre) as total_camas_por_estaus'))
                                ->join('servicios',     'camas.servicio_id',    '=', 'servicios.id')
                                ->join('estatus_cama',  'camas.estatus_cama_id','=',  'estatus_cama.id')
                                ->where('servicios.es_ambulatorio', '=', 0)
                                ->where('servicios.clues_id', '=', $datos['clues'])
                                ->where('camas.clues_id', '=', $datos['clues'])
                                ->groupBy('servicios.id','estatus_cama.nombre', 'servicios.nombre')
                                ->orderBy('camas.id')
                                ->get();

            $total_camas = Camas::select('servicios.id as servicio_id','servicios.nombre as nombre_servicio', DB::raw('count(servicios.nombre) as total_camas'))
                                ->join('servicios',     'camas.servicio_id',    '=', 'servicios.id')
                                ->join('estatus_cama',  'camas.estatus_cama_id','=',  'estatus_cama.id')
                                ->where('servicios.es_ambulatorio', '=', 0)
                                ->where('servicios.clues_id', '=', $datos['clues'])
                                ->where('camas.clues_id', '=', $datos['clues'])
                                ->groupBy('servicios.nombre', 'servicios.id')
                                ->orderBy('camas.id')
                                ->get();

            return response()->json([
                                    'total_estatus_camas'        =>$total_estatus_camas,
                                    'total_camas'                =>$total_camas,

                                    'total_estatus_camas_ambulatorias'     =>$total_estatus_camas_ambulatorias,
                                    'total_camas_ambulatorias'             =>$total_camas_ambulatorias,
                                    'total_ambulatorias'                   =>$total_ambulatorias

                                    
            ],HttpResponse::HTTP_OK);


        } catch (\Throwable $e) {
            return response()->json(['error'=>['message'=>$e->getMessage(),'line'=>$e->getLine()]], HttpResponse::HTTP_CONFLICT);
        }

    }

    public function getCamasAllMovil(Request $request)
    {

        try {

            $parametros = $request->all();


            $camas = Camas::orderBy('id')
            ->where('clues_id', $parametros['clues'])
            ->get();


            return response()->json(['catalogo_camas'=>$camas],HttpResponse::HTTP_OK);

        }catch(\Exception $e){
            return response()->json(['error'=>['message'=>$e->getMessage(),'line'=>$e->getLine()]], HttpResponse::HTTP_CONFLICT);
        }


    }



}
