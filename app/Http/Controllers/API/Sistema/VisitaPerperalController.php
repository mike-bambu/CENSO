<?php

namespace App\Http\Controllers\API\Sistema;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Http\Response as HttpResponse;
use Illuminate\Support\Facades\Hash;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Facades\DB;
use Response, Validator;
use Carbon\Carbon;

use App\Models\Sistema\Paciente;

use Maatwebsite\Excel\Facades\Excel;
use App\Exports\DevReportExport;

class VisitaPerperalController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {

        $parametros = $request->all();
        $actual = Carbon::today()->toDateString();
        $hoy = Carbon::createFromDate($actual)->format('Y-m-d');

        try{

            if(isset($parametros['ver_todos']) && $parametros['ver_todos']){

                $puerperas_embarazadas = Paciente::select('pacientes.id', 'pacientes.numero_expediente', 'pacientes.nombre', 'pacientes.paterno', 'pacientes.materno', 'pacientes.fecha_nacimiento', 'pacientes.edad', 'pacientes.tipo_edad', 'pacientes.esDesconocido', 'pacientes.edad_aparente', 'pacientes.alias', 'EMB.fecha_control_embarazo')
                ->with('municipio', 'localidad', 'pais_origen', 'estado_republica', 'ultimaAtencionAlta.alta', 'embarazo')
                ->leftjoin("embarazos as EMB", "EMB.paciente_id", "=", "pacientes.id")
                ->leftjoin("atenciones as ATN", "ATN.paciente_id", "=", "pacientes.id")
                ->leftjoin("altas as ALTA", "ALTA.atencion_id", "=", "ATN.id")
                ->where('ATN.dadodeAlta', '=', 1)
                ->where('ATN.estaEmbarazada', '=', 1)
                //->where('ALTA.esPuerperaEmbarazada', '=', 1)
                //->where('MUNI.distritos_id', '=', $parametros['distrito_id'])
                ->where('pacientes.tieneAtencion', '=', 0)
                ->orderBy('pacientes.created_at', 'DESC')->distinct();
    
                if(isset($parametros['query']) && $parametros['query']){
    
                    $puerperas_embarazadas = $puerperas_embarazadas->where(function($query)use($parametros){
                        return $query->where('folio_paciente','LIKE','%'.$parametros['query'].'%')
                                    ->orWhere('numero_expediente','LIKE','%'.$parametros['query'].'%')
                                    ->orWhere('alias','LIKE','%'.$parametros['query'].'%')
                                    ->orWhere('curp','LIKE','%'.$parametros['query'].'%')
                                    ->orWhere('nombre','LIKE','%'.$parametros['query'].'%')
                                    ->orWhere('paterno','LIKE','%'.$parametros['query'].'%')
                                    ->orWhere('materno','LIKE','%'.$parametros['query'].'%')
                                    ->orWhere('telefono_emergencia','LIKE','%'.$parametros['query'].'%')
                                    ->orWhere('telefono_celular','LIKE','%'.$parametros['query'].'%');
                    });
    
                }



            }else{

            
                $puerperas_embarazadas = Paciente::select('pacientes.id', 'pacientes.numero_expediente', 'pacientes.nombre', 'pacientes.paterno', 'pacientes.materno', 'pacientes.fecha_nacimiento', 'pacientes.edad', 'pacientes.tipo_edad', 'pacientes.esDesconocido', 'pacientes.edad_aparente', 'pacientes.alias', 'EMB.fecha_control_embarazo')
                ->with('municipio', 'localidad', 'pais_origen', 'estado_republica', 'ultimaAtencionAlta.alta', 'embarazo')
                ->leftjoin("embarazos as EMB", "EMB.paciente_id", "=", "pacientes.id")
                ->leftjoin("atenciones as ATN", "ATN.paciente_id", "=", "pacientes.id")
                ->leftjoin("altas as ALTA", "ALTA.atencion_id", "=", "ATN.id")
                ->where('EMB.puerperio', '=', 1)
                ->where('ATN.dadodeAlta', '=', 1)
                ->where('ATN.estaEmbarazada', '=', 1)
                //->where('ALTA.esPuerperaEmbarazada', '=', 1)
                ->where('MUNI.distritos_id', '=', $parametros['distrito_id'])
                ->where('pacientes.tieneAtencion', '=', 0)
                ->orderBy('pacientes.created_at', 'DESC')->distinct();

                if(isset($parametros['query']) && $parametros['query']){

                    $puerperas_embarazadas = $puerperas_embarazadas->where(function($query)use($parametros){
                        return $query->where('folio_paciente','LIKE','%'.$parametros['query'].'%')
                                    ->orWhere('numero_expediente','LIKE','%'.$parametros['query'].'%')
                                    ->orWhere('alias','LIKE','%'.$parametros['query'].'%')
                                    ->orWhere('curp','LIKE','%'.$parametros['query'].'%')
                                    ->orWhere('nombre','LIKE','%'.$parametros['query'].'%')
                                    ->orWhere('paterno','LIKE','%'.$parametros['query'].'%')
                                    ->orWhere('materno','LIKE','%'.$parametros['query'].'%')
                                    ->orWhere('telefono_emergencia','LIKE','%'.$parametros['query'].'%')
                                    ->orWhere('telefono_celular','LIKE','%'.$parametros['query'].'%');
                    });

                }
            }

            if(isset($parametros['active_filter']) && $parametros['active_filter']){

                if(isset($parametros['query']) && $parametros['query']){

                    $puerperas_embarazadas = $puerperas_embarazadas->where(function($query)use($parametros){
                        return $query->where('folio_paciente','LIKE','%'.$parametros['query'].'%')
                                    ->orWhere('numero_expediente','LIKE','%'.$parametros['query'].'%')
                                    ->orWhere('alias','LIKE','%'.$parametros['query'].'%')
                                    ->orWhere('curp','LIKE','%'.$parametros['query'].'%')
                                    ->orWhere('nombre','LIKE','%'.$parametros['query'].'%')
                                    ->orWhere('paterno','LIKE','%'.$parametros['query'].'%')
                                    ->orWhere('materno','LIKE','%'.$parametros['query'].'%')
                                    ->orWhere('telefono_emergencia','LIKE','%'.$parametros['query'].'%')
                                    ->orWhere('telefono_celular','LIKE','%'.$parametros['query'].'%');
                    });
    
                }



                if(isset($parametros['municipio_id']) && $parametros['municipio_id']){

                    $puerperas_embarazadas = $puerperas_embarazadas->where('ALTA.municipio_id',$parametros['municipio_id']);

                }

                if(isset($parametros['localidad_id']) && $parametros['localidad_id']){

                    $puerperas_embarazadas = $puerperas_embarazadas->where('ALTA.localidad_id',$parametros['localidad_id']);

                }

                if(isset($parametros['municipio_id'], $parametros['localidad_id'])){

                    $puerperas_embarazadas = $puerperas_embarazadas->where(function($q)use ($parametros) {
                        $q->where('ALTA.municipio_id',  $parametros['municipio_id'])
                        ->orWhere('ALTA.localidad_id',  $parametros['localidad_id']);
                    });

                }

                if(isset($parametros['condicion_egreso_id'], $parametros['condicion_egreso_id'])){

                    $puerperas_embarazadas = $puerperas_embarazadas->where('ALTA.condicion_egreso_id',$parametros['condicion_egreso_id']);

                }


            }

            if(isset($parametros['export_excel']) && $parametros['export_excel']){
                
                ini_set('memory_limit', '-1');

                try{

                    $puerperas_embarazadas = $puerperas_embarazadas->get();

                    unset($puerperas_embarazadas[0]->municipio, $puerperas_embarazadas[0]->localidad, $puerperas_embarazadas[0]->pais_origen, $puerperas_embarazadas[0]->estado_republica, $puerperas_embarazadas[0]->ultimaAtencionAlta);

                    $columnas = array_keys(collect($puerperas_embarazadas[0])->toArray());

                    if(isset($parametros['reporte']) && $parametros['reporte']){
                        $filename = $parametros['reporte'];
                    }else{
                        $filename = 'reporte-embarazadas-puerperas';
                    }
                    
                    //return (new DevReportExport($puerperas_embarazadas,$columnas))->download($filename.'.xlsx'); //Excel::XLSX, ['Access-Control-Allow-Origin'=>'*','Access-Control-Allow-Methods'=>'GET']
                    return (new DevReportExport($puerperas_embarazadas,$columnas))->download($filename.'.xlsx');
                }catch(\Exception $e){
                    return response()->json(['error' => $e->getMessage(),'line'=>$e->getLine()], HttpResponse::HTTP_CONFLICT);
                }

            }
    
            if(isset($parametros['page'])){
                $resultadosPorPagina = isset($parametros["per_page"])? $parametros["per_page"] : 20;
    
                $puerperas_embarazadas = $puerperas_embarazadas->paginate($resultadosPorPagina);
            } else {
                $puerperas_embarazadas = $puerperas_embarazadas->get();
            }

            return response()->json(['data'=>$puerperas_embarazadas,'fecha_actual'=>$hoy],HttpResponse::HTTP_OK);
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
        //
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {

        $paciente = Paciente::with('municipio', 'localidad', 'pais_origen', 'estado_republica', 'ultimaAtencionAlta.alta')->find($id);

        if(!$paciente){
            return response()->json(['No se encuentra el recurso que esta buscando.'], HttpResponse::HTTP_CONFLICT);
            //404
        }

        return response()->json(['data' => $paciente], 200);
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
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        //
    }
}
