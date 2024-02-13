<?php

namespace App\Http\Controllers\API\Sistema;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Http\Response as HttpResponse;
use App\Models\Sistema\Calidad;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;
use Illuminate\Support\Facades\Validator;
use Response;
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
        $data = $request->all();
        $user = auth()->userOrFail();
        $actual = Carbon::today()->toDateString();
        $hoy = Carbon::createFromDate($actual)->format('Y-m-d');
        $year = Carbon::createFromDate($actual)->format('YYYY');

        $data_parto = $data['initParto'];
       

        $validation_rules = [
            'type' => 'required',
            'fecha_init_quiz'=> 'required',
            'clues_id'=> 'required',
            'iterations_quiz'=> 'required',
        ];

        $validation_eror_messajes = [
            'type.required' => 'el tipo de medición es necesario.',
            'fecha_init_quiz.required'   => 'la fecha de medición es necesario.',  
            'clues_id.required'   => 'la clue del usuario es necesaria.',  
            'iterations_quiz.required'   => 'El total de expedientes es requerido.',  
        ];

        $resultado = Validator::make($data_parto,$validation_rules,$validation_eror_messajes);

            if ($resultado->fails()) {
                return response()->json(['mensaje' => 'Error en los datos del formulario', 'validacion'=>$resultado->passes(), 'errores'=>$resultado->errors()], HttpResponse::HTTP_CONFLICT);
            }else{

                if (is_array($data_parto)){
                    $data_parto = (object) $data_parto;
                }

                $date_measurement = Carbon::createFromDate($data_parto->fecha_init_quiz)->format('Y-m-d');
                $month=$data_parto->month_measurement;
                $user_id=$user->id;
                $clues_id=$data_parto->clues_id;
                $validate_measurement = Calidad::where('month_measurement',$month)->where('year_measurement','2024')->where('user_id',$user_id)->where('clues_id',$clues_id)->first();

                if($validate_measurement === null ){
                $date_measurement = Carbon::createFromDate($data_parto->fecha_init_quiz)->format('Y-m-d');
                    
                $header_quality = new Calidad();
                $header_quality->user_id = $user_id;
                $header_quality->clues_id = $clues_id;
                $header_quality->total_files = $data_parto->iterations_quiz;
                $header_quality->measurement_type = $data_parto->type;
                $header_quality->date_start = $date_measurement;
                $header_quality->month_measurement = $month;
                $header_quality->year_measurement = '2024';

                $header_quality->save();

                return Response::json(array("status" => 200, "messages" => "Se agrego la información con exito", "data" => $data), 200);
            }
                else
                    return response()->json(['mensaje' => 'El mes a validar ya se encuentra registradoxx'], HttpResponse::HTTP_CONFLICT);
            }


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
