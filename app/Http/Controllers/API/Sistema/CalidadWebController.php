<?php

namespace App\Http\Controllers\API\Sistema;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Http\Response as HttpResponse;
use App\Models\Sistema\Calidad;
use Illuminate\Support\Facades\DB;

class CalidadWebController extends Controller
{

    public function index(Request $request)
    {
        try {
            $params = $request->all();
            $usuario = auth()->userOrFail();
          
             if(isset($params['type'])){
                $calidad = Calidad::select('quality_measurements.*')->where('measurement_type',$params['type'])
                ->where('user_id', $usuario->id)->get();
                if(!$calidad){
                    return response()->json(['No se encuentra el recurso que esta buscando.'], HttpResponse::HTTP_CONFLICT);
                }
                    return response()->json(['calidad' => $calidad], 200);

            }
            else{
                $calidad = Calidad::select('quality_measurements.*')->where('user_id', $usuario->id)->get();
                if(!$calidad){
                    return response()->json(['No se encuentra el recurso que esta buscando.'], HttpResponse::HTTP_CONFLICT);
                }
                    return response()->json(['calidad' => $calidad], 200);
            } 
            
        } catch (\Exception $e) {
                        return response()->json(['Result' => $e], 404);
                    }
    }

    public function store(Request $request)
    {
        //
    }

    public function show($id)
    {   
        $usuario = auth()->userOrFail();
        $calidad = Calidad::select('quality_measurements.*')->where('user_id', $usuario->id)->find($id);
        if(!$calidad){
            return response()->json(['No se encuentra el recurso que esta buscando.'], HttpResponse::HTTP_CONFLICT);
        }
            return response()->json(['calidad' => $calidad], 200);    
    }

    public function update(Request $request, $id)
    {
        //
    }

    public function destroy($id)
    {
        //
    }
}
