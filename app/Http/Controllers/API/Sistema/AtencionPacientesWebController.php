<?php

namespace App\Http\Controllers\API\Sistema;

use Illuminate\Http\Request;
use Illuminate\Http\Response as HttpResponse;

//use Illuminate\Support\Facades\Input;
use Illuminate\Support\Facades\Hash;

use App\Http\Controllers\Controller;

use Illuminate\Support\Facades\DB;

use Illuminate\Database\Eloquent\Collection;

use Response;
use Illuminate\Support\Facades\Validator;

use Carbon\Carbon;

use App\Models\Sistema\Paciente;
use App\Models\Sistema\Atencion;
use App\Models\Sistema\Seguimiento;
use App\Models\Sistema\Diagnostico;
use App\Models\Sistema\SeguimientoDiagnostico;

use App\Models\Catalogos\Clue;
use App\Models\Catalogos\EstadoActual;

use App\Models\Catalogos\Municipio;
use App\Models\Catalogos\Localidad;





class AtencionPacientesWebController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        //
    }

    public function getAtencionesPacientes(Request $request)
    {

        $actual = Carbon::today()->toDateString();
        $hoy = Carbon::createFromDate($actual)->format('Y-m-d');

        $parametros = $request->all();
        $usuario = auth()->userOrFail();

        $servicios = array();
        if(isset($parametros['servicios']) && $parametros['servicios']){

            foreach ($parametros['servicios'] as $key => $value) {

                $servicios[$key] = $value['id'];
    
            }

        }

        

        // $permiso_todos = DB::table('permissions')
        // ->leftJoin('permission_user', 'permissions.id', '=', 'permission_user.permission_id')
        // ->where('permission_user.user_id', '=', $usuario->id)
        // ->where('permission_user.permission_id', '=', 'P5gCJH25AeIwy2IOmvCYtHKg5XL3hKd0')
        // ->first();


        // $userClues = DB::table('clue_user')
        // ->where('user_id', $usuario->id)->first();

        // $userServicio = DB::table('servicio_user')
        // ->where('user_id', $usuario->id)->first();

        try{

            if(isset($parametros['ver_pacientes_todos']) && $parametros['ver_pacientes_todos'] && $parametros['clues']){

                $pacientes = Paciente::select('pacientes.*')
                ->with('municipio', 'localidad', 'pais_origen', 'estado_republica', 'embarazo', 'atenciones.seguimientos', 'atenciones.alta', 'ultimaAtencion.ultimoSeguimiento')
                ->leftJoin('atenciones as ATN_GENERAL', 'ATN_GENERAL.paciente_id', '=', 'pacientes.id')
                // ->leftJoin('seguimientos', function($query){
                //     $query->on('ATN_GENERAL.id','=','seguimientos.atencion_id')
                //     ->whereRaw('seguimientos.id IN (select MAX(SEG.id) from seguimientos as SEG join atenciones as ATEN_ACT on ATEN_ACT.id = SEG.atencion_id group by ATEN_ACT.id)');
                // })
                ->where('ATN_GENERAL.dadodeAlta', '=', 0)
                ->where('tieneAtencion', '=', 1)
                ->where('ATN_GENERAL.clues_id','=',$parametros['clues'])
                ->orderBy('ATN_GENERAL.updated_at', 'DESC');

            }

            else if(isset($parametros['ver_todo_distrito']) && $parametros['ver_todo_distrito'] && $parametros['distrito']){

                $pacientes = Paciente::select('pacientes.*')
                ->with('municipio', 'localidad', 'pais_origen', 'estado_republica', 'embarazo', 'atenciones.seguimientos', 'atenciones.alta', 'ultimaAtencion.ultimoSeguimiento')
                ->leftJoin('atenciones as ATN_GENERAL', 'ATN_GENERAL.paciente_id', '=', 'pacientes.id')
                // ->leftJoin('seguimientos', function($query){
                //     $query->on('ATN_GENERAL.id','=','seguimientos.atencion_id')
                //     ->whereRaw('seguimientos.id IN (select MAX(SEG.id) from seguimientos as SEG join atenciones as ATEN_ACT on ATEN_ACT.id = SEG.atencion_id group by ATEN_ACT.id)');
                // })
                ->leftjoin('clues as CLUES_DISTRITO', 'CLUES_DISTRITO.id','=','ATN_GENERAL.clues_id')
                ->where('CLUES_DISTRITO.distritos_id', '=', $parametros['distrito'])
                ->where('ATN_GENERAL.dadodeAlta', '=', 0)
                ->where('tieneAtencion', '=', 1)
                //->where('ATN_GENERAL.clues_id','=',$parametros['clues'])
                ->orderBy('ATN_GENERAL.updated_at', 'DESC');


            }

            else if ( !empty($servicios) && $parametros['clues']){

                $pacientes = Paciente::select('pacientes.*')
                ->with('municipio', 'localidad', 'pais_origen', 'estado_republica', 'embarazo', 'atenciones.seguimientos', 'atenciones.alta', 'ultimaAtencion.ultimoSeguimiento')
                ->leftJoin('atenciones as ATN_GENERAL', 'pacientes.id','=','ATN_GENERAL.paciente_id')
                // ->leftJoin('seguimientos', function($query){
                //     $query->on('ATN_GENERAL.id','=','seguimientos.atencion_id')
                //     ->whereRaw('seguimientos.id IN (select MAX(SEG.id) from seguimientos as SEG join atenciones as ATEN_ACT on ATEN_ACT.id = SEG.atencion_id group by ATEN_ACT.id)');
                // })
                ->where('ATN_GENERAL.dadodeAlta', '=', 0)
                ->where('tieneAtencion', '=', 1)
                ->whereIn('ATN_GENERAL.ultimo_servicio_id', $servicios)
                ->where('ATN_GENERAL.clues_id', $parametros['clues'])
                ->orderBy('ATN_GENERAL.updated_at', 'DESC')->distinct();

            }
            // else if ( $usuario->is_superuser ){

            //     $pacientes = Paciente::select('pacientes.*')
            //     ->with('municipio', 'localidad', 'pais_origen', 'estado_republica', 'atenciones.seguimientos', 'atenciones.alta', 'ultimaAtencion.ultimoSeguimiento')
            //     ->join('atenciones as ATN_GENERAL', 'pacientes.id','=','ATN_GENERAL.paciente_id')
            //     ->where('tieneAtencion', '=', 1)
            //     ->orderBy('ATN_GENERAL.created_at', 'DESC')->distinct();

            // }

            // if($userClues && $permiso_todos != NULL){

            //     $pacientes = Paciente::select('pacientes.*')
            //     ->with('municipio', 'localidad', 'pais_origen', 'estado_republica', 'atenciones.seguimientos', 'atenciones.alta', 'ultimaAtencion.ultimoSeguimiento')
            //     ->join('atenciones as ATN_GENERAL', 'pacientes.id','=','ATN_GENERAL.paciente_id')
            //     ->where('tieneAtencion', '=', 1)
            //     ->where('ATN_GENERAL.clues_id','=',$userClues->clue_id)
            //     ->orderBy('ATN_GENERAL.created_at', 'DESC')->distinct();
                
            // }else if($userServicio){

            //     $pacientes = Paciente::select('pacientes.*')
            //     ->with('municipio', 'localidad', 'pais_origen', 'estado_republica', 'atenciones.seguimientos', 'atenciones.alta', 'ultimaAtencion.ultimoSeguimiento')
            //     ->join('atenciones as ATN_GENERAL', 'pacientes.id','=','ATN_GENERAL.paciente_id')
            //     ->where('tieneAtencion', '=', 1)
            //     ->where('ATN_GENERAL.servicio_id', $userServicio->servicio_id)
            //     ->where('ATN_GENERAL.clues_id', $userClues->clue_id)
            //     ->orderBy('ATN_GENERAL.created_at', 'DESC')->distinct();

            // }

            //Filtros, busquedas, ordenamiento
            if(isset($parametros['query']) && $parametros['query']){
                $pacientes = $pacientes->where(function($query)use($parametros){
                    return $query->whereRaw('concat(nombre," ", paterno, " ", materno) like "%'.$parametros['query'].'%"' )
                                ->orWhere('folio_paciente','LIKE','%'.$parametros['query'].'%')
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

            if(isset($parametros['active_filter']) && $parametros['active_filter']){



                

                if(isset($parametros['query']) && $parametros['query']){
                    $pacientes = $pacientes->where(function($query)use($parametros){
                        return $query->whereRaw('concat(nombre," ", paterno, " ", materno) like "%'.$parametros['query'].'%"' )
                                    ->orWhere('folio_paciente','LIKE','%'.$parametros['query'].'%')
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

                // if(isset($parametros['fecha_ingreso']) && $parametros['fecha_ingreso']){

                //     $f = Carbon::createFromDate( $parametros['fecha_ingreso'] )->format('Y-m-d');
                //     $pacientes = $pacientes->where('fecha_ingreso',$f);

                // }

                if(isset($parametros['fecha_inicio'], $parametros['fecha_fin'])){

                    $pacientes = $pacientes->whereBetween(DB::raw('DATE(ATN_GENERAL.fecha_inicio_atencion)'), [$parametros['fecha_inicio'], $parametros['fecha_fin']]);

                }

                // if(isset($parametros['edad']) && $parametros['edad']){

                //     $pacientes = $pacientes->where('edad',$parametros['edad']);

                // }

                if(isset($parametros['tipo_edad'], $parametros['edad'])){

                    $pacientes = $pacientes->where('tipo_edad', $parametros['tipo_edad'])->where('edad', $parametros['edad']);


                }

                if(isset($parametros['sexo']) && $parametros['sexo']){

                    $pacientes = $pacientes->where('sexo',$parametros['sexo']);

                }

                if(isset($parametros['nacionalidad'])){


                    $pacientes = $pacientes->where('esExtranjero',$parametros['nacionalidad']);

                }

                if(isset($parametros['atencion'])){


                    $pacientes = $pacientes->where('tieneAtencion',$parametros['atencion']);

                }

                if(isset($parametros['ambulatorios'])){



                    if($parametros['ambulatorios'] === "NULL"){

                        $pacientes = $pacientes
                        //->join('atenciones as ATN_GENERAL_AMBULATORIOS', 'pacientes.id','=','ATN_GENERAL_AMBULATORIOS.paciente_id')
                        ->whereNull('ATN_GENERAL.esAmbulatoria');

                    }else{

                        $pacientes = $pacientes
                        //->join('atenciones as ATN_GENERAL_AMBULATORIOS', 'pacientes.id','=','ATN_GENERAL_AMBULATORIOS.paciente_id')
                        ->where('ATN_GENERAL.esAmbulatoria',$parametros['ambulatorios']);

                    }
                                           

                }

                if(isset($parametros['identidad'])){

                    $pacientes = $pacientes->where('esDesconocido',$parametros['identidad']);

                }

                

                if(isset($parametros['municipio_id']) && $parametros['municipio_id']){

                    $pacientes = $pacientes->where('municipio_id',$parametros['municipio_id']);

                }

                if(isset($parametros['localidad_id']) && $parametros['localidad_id']){

                    $pacientes = $pacientes->where('localidad_id',$parametros['localidad_id']);

                }

                if(isset($parametros['municipio_id'], $parametros['localidad_id'])){

                    $pacientes = $pacientes->where(function($q)use ($parametros) {
                        $q->where('municipio_id',  $parametros['municipio_id'])
                        ->orWhere('localidad_id',  $parametros['localidad_id']);
                    });

                }

                if(isset($parametros['especialidad_id']) && $parametros['especialidad_id']){

                    $pacientes = $pacientes
                    ->orWhere('ATN_GENERAL.ultima_especialidad_id', $parametros['especialidad_id']);
                    //->join('atenciones as ATN_GENERAL_ESPECIALIDAD', 'pacientes.id','=','ATN_GENERAL_ESPECIALIDAD.paciente_id')

                }

                if(isset($parametros['servicio_id']) && $parametros['servicio_id']){

                    $pacientes = $pacientes
                    ->where('ATN_GENERAL.ultimo_servicio_id', $parametros['servicio_id']);
                    //->orWhere('seguimiento.servicio_id', $parametros['servicio_id']);
                    //->join('atenciones as ATN_GENERAL_SERVICIO', 'pacientes.id','=','ATN_GENERAL_SERVICIO.paciente_id')

                }


                if(isset($parametros['estado_actual_id']) && $parametros['estado_actual_id']){

                    $pacientes = $pacientes
                    ->where('ATN_GENERAL.ultimo_estado_actual_id', $parametros['estado_actual_id']);
                    //->orWhere('seguimiento.estado_actual_id', $parametros['estado_actual_id']);
                    //->join('atenciones as ATN_GENERAL_ESTADO_ACTUAL', 'pacientes.id','=','ATN_GENERAL_ESTADO_ACTUAL.paciente_id')


                }

                // if(isset($parametros['diagnosticos']) && $parametros['diagnosticos']){

                //     $pacientes = $pacientes->join('seguimientos as SDP', 'SDP.paciente_id', '=', 'pacientes.id')
                //                            ->join('seguimiento_diagnostico as SD', 'SD.seguimiento_id', '=', 'SDP.id')
                //                            ->join('diagnosticos as D', 'SD.diagnostico_id', '=', 'D.id')
                //                            ->where('SD.diagnostico_id', $parametros['diagnosticos'])->distinct();
                // }
            }

            if(isset($parametros['page'])){
                $resultadosPorPagina = isset($parametros["per_page"])? $parametros["per_page"] : 20;
                
                $pacientes = $pacientes->paginate($resultadosPorPagina);
                //$pacientes[$key]->fec = $diff;

            } else {
                $pacientes = $pacientes->get();
            }

            return response()->json(['data'=>$pacientes, 'fecha_actual'=>$hoy],HttpResponse::HTTP_OK);
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
    public function store(Request $request) {


            $data = $request->all();

            $data_paciente = $data['pacientes'];
            $data_atencion = $data['atencion'];

            $validation_rules = [

                'curp' => 'required|unique:pacientes',
            ];
        
            $validation_eror_messajes = [

                'curp.required' => 'La captura de la CURP es Obligatoria.',
                'curp.unique'   => 'La CURP ya se encuentra registrada con otro Paciente.',
                
            ];
            

            $resultado = Validator::make($data_paciente,$validation_rules,$validation_eror_messajes);

            if ($resultado->fails()) {
                return response()->json(['mensaje' => 'Error en los datos del formulario', 'validacion'=>$resultado->passes(), 'errores'=>$resultado->errors()], HttpResponse::HTTP_CONFLICT);
            }else{


                if (is_array($data_paciente))
                $data_paciente = (object) $data_paciente;

                if (is_array($data_atencion))
                $data_atencion = (object) $data_atencion;
        
                try {


                            if($data_paciente->tieneAtencion == 0){

                                $paciente = new Paciente();

                                $paciente->folio_paciente           = mb_strtoupper($data_paciente->folio_paciente, 'UTF-8');
                                $paciente->numero_expediente        = mb_strtoupper($data_paciente->numero_expediente, 'UTF-8');
                                $paciente->tieneAtencion            = $data_paciente->tieneAtencion;
                                $paciente->nombre                   = mb_strtoupper($data_paciente->nombre, 'UTF-8');
                                $paciente->paterno                  = mb_strtoupper($data_paciente->paterno, 'UTF-8');
                                $paciente->materno                  = mb_strtoupper($data_paciente->materno, 'UTF-8');
                                $paciente->edad                     = $data_paciente->edad;
                                $paciente->edad_aparente            = $data_paciente->edad_aparente; 
                                $paciente->sexo                     = $data_paciente->sexo;            
                                $paciente->fecha_nacimiento         = Carbon::createFromDate($data_paciente->fecha_nacimiento)->format('Y-m-d');
                                $paciente->curp                     = mb_strtoupper($data_paciente->curp, 'UTF-8');
                                $paciente->estado_republica_id      = $data_paciente->estado_republica_id;
                                $paciente->municipio_id             = $data_paciente->municipio_id;    
                                $paciente->localidad_id             = $data_paciente->localidad_id;    
                                $paciente->esDesconocido            = $data_paciente->esDesconocido;   
                                $paciente->alias                    = mb_strtoupper($data_paciente->alias, 'UTF-8');       
                                $paciente->esExtranjero             = $data_paciente->esExtranjero;    
                                $paciente->pais_origen_id           = $data_paciente->pais_origen_id;  
                                $paciente->telefono_emergencia            = $data_paciente->telefono_emergencia;   
                                $paciente->telefono_celular         = $data_paciente->telefono_celular;
                                $paciente->calle                    = mb_strtoupper($data_paciente->calle, 'UTF-8');       
                                $paciente->colonia                  = mb_strtoupper($data_paciente->colonia, 'UTF-8');      
                                $paciente->no_exterior              = $data_paciente->no_exterior;     
                                $paciente->no_interior              = $data_paciente->no_interior;     
                                $paciente->entreCalles              = mb_strtoupper($data_paciente->entreCalles, 'UTF-8');   
                                $paciente->cp                       = $data_paciente->cp;              
                                $paciente->user_id                  = $data_paciente->user_id;         
        
                                $paciente->save();

                            }elseif($data_paciente->tieneAtencion == 1 && $data_atencion->esAmbulatoria == 1){

                                    $paciente = new Paciente();

                                    $paciente->folio_paciente           = $data_paciente->folio_paciente;
                                    $paciente->numero_expediente        = $data_paciente->numero_expediente;
                                    $paciente->tieneAtencion            = $data_paciente->tieneAtencion;
                                    $paciente->nombre                   = mb_strtoupper($data_paciente->nombre, 'UTF-8');
                                    $paciente->paterno                  = mb_strtoupper($data_paciente->paterno, 'UTF-8');
                                    $paciente->materno                  = mb_strtoupper($data_paciente->materno, 'UTF-8');
                                    $paciente->edad                     = $data_paciente->edad;
                                    $paciente->edad_aparente            = $data_paciente->edad_aparente; 
                                    $paciente->sexo                     = $data_paciente->sexo;            
                                    $paciente->fecha_nacimiento         = Carbon::createFromDate($data_paciente->fecha_nacimiento)->format('Y-m-d');
                                    $paciente->curp                     = $data_paciente->curp;
                                    $paciente->estado_republica_id      = $data_paciente->estado_republica_id; 
                                    $paciente->municipio_id             = $data_paciente->municipio_id;    
                                    $paciente->localidad_id             = $data_paciente->localidad_id;    
                                    $paciente->esDesconocido            = $data_paciente->esDesconocido;   
                                    $paciente->alias                    = $data_paciente->alias;           
                                    $paciente->esExtranjero             = $data_paciente->esExtranjero;    
                                    $paciente->pais_origen_id           = $data_paciente->pais_origen_id;  
                                    $paciente->telefono_emergencia            = $data_paciente->telefono_emergencia;   
                                    $paciente->telefono_celular         = $data_paciente->telefono_celular;
                                    $paciente->calle                    = mb_strtoupper($data_paciente->calle, 'UTF-8');       
                                    $paciente->colonia                  = mb_strtoupper($data_paciente->colonia, 'UTF-8');      
                                    $paciente->no_exterior              = $data_paciente->no_exterior;     
                                    $paciente->no_interior              = $data_paciente->no_interior;     
                                    $paciente->entreCalles              = mb_strtoupper($data_paciente->entreCalles, 'UTF-8');   
                                    $paciente->cp                       = $data_paciente->cp;              
                                    $paciente->user_id                  = $data_paciente->user_id;         
            
                                    if($paciente->save())

                                    $atencion = new Atencion();
        
                                    $atencion->folio_atencion                           =  $data_atencion->folio_atencion;
                                    $atencion->esAmbulatoria                            =  $data_atencion->esAmbulatoria;
                                    $atencion->esUrgenciaCalificada                     =  $data_atencion->esUrgenciaCalificada;
                                    $atencion->fecha_inicio_atencion                    =  Carbon::createFromDate($data_atencion->fecha_inicio_atencion)->format('Y-m-d');
                                    $atencion->hora                                     =  $data_atencion->hora;
                                    $atencion->motivo_atencion                          =  mb_strtoupper($data_atencion->motivo_atencion, 'UTF-8');  
                                    $atencion->indicaciones                             =  mb_strtoupper($data_atencion->indicaciones, 'UTF-8'); 
                                    $atencion->gestas                                   =  $data_atencion->gestas;
                                    $atencion->partos                                   =  $data_atencion->partos;
                                    $atencion->cesareas                                 =  $data_atencion->cesareas;
                                    $atencion->abortos                                  =  $data_atencion->abortos;
                                    $atencion->semanas_gestacionales                    =  $data_atencion->semanas_gestacionales;
                                    $atencion->estaEmbarazada                           =  $data_atencion->estaEmbarazada;
                                    $atencion->fueReferida                              =  $data_atencion->fueReferida;
                                    $atencion->metodo_gestacional_id                    =  $data_atencion->metodo_gestacional_id;
                                    $atencion->clues_referencia_id                      =  $data_atencion->clues_referencia_id;
                                    $atencion->dadodeAlta                               =  $data_atencion->dadodeAlta;
                                    $atencion->estado_actual_id                         =  $data_atencion->estado_actual_id;
                                    $atencion->servicio_id                              =  $data_atencion->servicio_id;
                                    $atencion->no_cama                                  =  property_exists($data_atencion, "no_cama") ? $data_atencion->no_cama: $atencion->no_cama;
                                    $atencion->cama_id                                  =  property_exists($data_atencion, "cama_id") ? $data_atencion->cama_id: $data_atencion->cama_id;
                                    $atencion->especialidad_id                          =  $data_atencion->especialidad_id;
                                    $atencion->clue_atencion_embarazo_id                =  $data_atencion->clue_atencion_embarazo_id;
                                    $atencion->fecha_ultima_atencion_embarazo           =  $data_atencion->fecha_ultima_atencion_embarazo;
                                    $atencion->clues_control_embarazo_id                =  $data_atencion->clues_control_embarazo_id;
                                    $atencion->fecha_control_embarazo                   =  $data_atencion->fecha_control_embarazo;
                                    $atencion->clues_id                                 =  $data_atencion->clues_id;
                                    $atencion->paciente_id                              =  $paciente->id;
        
                                   if($atencion->save()){

                                        DB::table('camas')
                                        ->where('id', $data_atencion->cama_id)
                                        ->update([
                                            'estatus_cama_id'        => 4,
                                        ]);

                                   }
        

                            }

                            return Response::json(array("status" => 200, "messages" => "Se agrego la información del paciente con exito", "data" => $data), 200);
                            
                }

                catch (\Exception $e) {
                    return Response::json($e->getMessage(), 500);
                }



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

        $paciente = Paciente::with('municipio','localidad', 'estado_republica', 'pais_origen', 'embarazo', 'atenciones', 'ultimaAtencion')->find($id);

        if(!$paciente){
            return response()->json(['No se encuentra el recurso que esta buscando.'], HttpResponse::HTTP_CONFLICT);
            //404
        }

        return response()->json(['paciente' => $paciente], 200);
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


            $input = $request->all();

            $data_paciente = $input['pacientes'];
            $data_atencion = $input['atencion'];

            $validation_rules = [];

            $validation_eror_messajes = [
                'id.required'   => 'El ID es requerido.',
                'id.unique'     => 'El ID debe ser único.',
                'curp.unique'   => 'La CURP ya se encuentra registrada con otro Paciente.',
            ];

            

            if(isset($data_paciente['id']) && $data_paciente['id'] != $id){
                $validation_rules['id'] = 'required|unique:pacientes';
            }

            $resultado = Validator::make($data_paciente,$validation_rules,$validation_eror_messajes);

            if ($resultado->fails()) {
                return response()->json(['mensaje' => 'Error en los datos del formulario', 'validacion'=>$resultado->passes(), 'errores'=>$resultado->errors()], HttpResponse::HTTP_CONFLICT);
            }else{

                try {
                    $paciente = Paciente::find($id);
    
    
    
    
                    if (is_array($data_paciente))
                        $data_paciente = (object) $data_paciente;
    
                    if (is_array($data_atencion))
                        $data_atencion = (object) $data_atencion;
    
    
                    if(!$paciente){
                        return response()->json(['error' => "No se encuentra el recurso que esta buscando."], HttpResponse::HTTP_NOT_FOUND);
                    }else{
    
                        //if($data_paciente->tieneAtencion == 0){
    
                            $paciente->folio_paciente           = mb_strtoupper($data_paciente->folio_paciente, 'UTF-8');
                            $paciente->numero_expediente        = mb_strtoupper($data_paciente->numero_expediente, 'UTF-8');
                            $paciente->tieneAtencion            = $data_paciente->tieneAtencion;
                            $paciente->nombre                   = mb_strtoupper($data_paciente->nombre, 'UTF-8');
                            $paciente->paterno                  = mb_strtoupper($data_paciente->paterno, 'UTF-8');
                            $paciente->materno                  = mb_strtoupper($data_paciente->materno, 'UTF-8');
                            $paciente->edad                     = $data_paciente->edad;
                            $paciente->edad_aparente            = $data_paciente->edad_aparente; 
                            $paciente->sexo                     = $data_paciente->sexo;            
                            $paciente->fecha_nacimiento         = Carbon::createFromDate($data_paciente->fecha_nacimiento)->format('Y-m-d');
                            $paciente->curp                     = mb_strtoupper($data_paciente->curp, 'UTF-8');
                            $paciente->estado_republica_id      = $data_paciente->estado_republica_id; 
                            $paciente->municipio_id             = $data_paciente->municipio_id;    
                            $paciente->localidad_id             = $data_paciente->localidad_id;    
                            $paciente->esDesconocido            = $data_paciente->esDesconocido;   
                            $paciente->alias                    = mb_strtoupper($data_paciente->alias, 'UTF-8');           
                            $paciente->esExtranjero             = $data_paciente->esExtranjero;    
                            $paciente->pais_origen_id           = $data_paciente->pais_origen_id;  
                            $paciente->telefono_emergencia            = $data_paciente->telefono_emergencia;   
                            $paciente->telefono_celular         = $data_paciente->telefono_celular;
                            $paciente->calle                    = mb_strtoupper($data_paciente->calle, 'UTF-8');       
                            $paciente->colonia                  = mb_strtoupper($data_paciente->colonia, 'UTF-8');      
                            $paciente->no_exterior              = $data_paciente->no_exterior;     
                            $paciente->no_interior              = $data_paciente->no_interior;     
                            $paciente->entreCalles              = mb_strtoupper($data_paciente->entreCalles, 'UTF-8');   
                            $paciente->cp                       = $data_paciente->cp;              
                            $paciente->user_id                  = $data_paciente->user_id;         
    
                            $paciente->save();
    
                            // $atencion = Atencion::find($data_atencion->id);
                            // $atencion->delete();
    
                        /*}elseif($data_paciente->tieneAtencion == 1 && $data_atencion->esAmbulatoria == 1){
    
                                $paciente->folio_paciente           = mb_strtoupper($data_paciente->folio_paciente, 'UTF-8');
                                $paciente->numero_expediente        = mb_strtoupper($data_paciente->numero_expediente, 'UTF-8');
                                $paciente->tieneAtencion            = $data_paciente->tieneAtencion;
                                $paciente->nombre                   = mb_strtoupper($data_paciente->nombre, 'UTF-8');
                                $paciente->paterno                  = mb_strtoupper($data_paciente->paterno, 'UTF-8');
                                $paciente->materno                  = mb_strtoupper($data_paciente->materno, 'UTF-8');
                                $paciente->edad                     = $data_paciente->edad;
                                $paciente->edad_aparente            = $data_paciente->edad_aparente; 
                                $paciente->sexo                     = $data_paciente->sexo;            
                                $paciente->fecha_nacimiento         = Carbon::createFromDate($data_paciente->fecha_nacimiento)->format('Y-m-d');
                                $paciente->curp                     = $data_paciente->curp;
                                $paciente->estado_republica_id      = $data_paciente->estado_republica_id; 
                                $paciente->municipio_id             = $data_paciente->municipio_id;    
                                $paciente->localidad_id             = $data_paciente->localidad_id;    
                                $paciente->esDesconocido            = $data_paciente->esDesconocido;   
                                $paciente->alias                    = mb_strtoupper($data_paciente->alias, 'UTF-8');          
                                $paciente->esExtranjero             = $data_paciente->esExtranjero;    
                                $paciente->pais_origen_id           = $data_paciente->pais_origen_id;  
                                $paciente->telefono_emergencia            = $data_paciente->telefono_emergencia;   
                                $paciente->telefono_celular         = $data_paciente->telefono_celular;
                                $paciente->calle                    = mb_strtoupper($data_paciente->calle, 'UTF-8');       
                                $paciente->colonia                  = mb_strtoupper($data_paciente->colonia, 'UTF-8');      
                                $paciente->no_exterior              = $data_paciente->no_exterior;     
                                $paciente->no_interior              = $data_paciente->no_interior;     
                                $paciente->entreCalles              = mb_strtoupper($data_paciente->entreCalles, 'UTF-8');   
                                $paciente->cp                       = $data_paciente->cp;              
                                $paciente->user_id                  = $data_paciente->user_id;         
        
                                if($paciente->save())
    
                                $atencion = new Atencion();
    
                                $atencion->folio_atencion                           =  $data_atencion->folio_atencion;
                                $atencion->esAmbulatoria                            =  $data_atencion->esAmbulatoria;
                                $atencion->fecha_inicio_atencion                    =  Carbon::createFromDate($data_atencion->fecha_inicio_atencion)->format('Y-m-d');
                                $atencion->hora                                     =  $data_atencion->hora;
                                $atencion->motivo_atencion                          =  mb_strtoupper($data_atencion->motivo_atencion, 'UTF-8');  
                                $atencion->indicaciones                             =  mb_strtoupper($data_atencion->indicaciones, 'UTF-8'); 
                                $atencion->gestas                                   =  $data_atencion->gestas;
                                $atencion->partos                                   =  $data_atencion->partos;
                                $atencion->cesareas                                 =  $data_atencion->cesareas;
                                $atencion->abortos                                  =  $data_atencion->abortos;
                                $atencion->semanas_gestacionales                    =  $data_atencion->semanas_gestacionales;
                                $atencion->estaEmbarazada                           =  $data_atencion->estaEmbarazada;
                                $atencion->fueReferida                              =  $data_atencion->fueReferida;
                                $atencion->metodo_gestacional_id                    =  $data_atencion->metodo_gestacional_id;
                                $atencion->clues_referencia_id                      =  $data_atencion->clues_referencia_id;
                                $atencion->dadodeAlta                               =  $data_atencion->dadodeAlta;
                                $atencion->estado_actual_id                         =  $data_atencion->estado_actual_id;
                                $atencion->servicio_id                              =  $data_atencion->servicio_id;
                                $atencion->no_cama                                  =  $data_atencion->no_cama;
                                $atencion->especialidad_id                          =  $data_atencion->especialidad_id;
                                $atencion->clue_atencion_embarazo_id                =  $data_atencion->clue_atencion_embarazo_id;
                                $atencion->fecha_ultima_atencion_embarazo           =  $data_atencion->fecha_ultima_atencion_embarazo;
                                $atencion->clues_control_embarazo_id                =  $data_atencion->clues_control_embarazo_id;
                                $atencion->fecha_control_embarazo                   =  $data_atencion->fecha_control_embarazo;
                                $atencion->clues_id                                 =  $data_atencion->clues_id;
                                $atencion->paciente_id                              =  $paciente->id;
    
                                $atencion->save();
                        }*/
    
                            return Response::json(array("status" => 200, "messages" => "Se actualizo la información del paciente con exito", "data" => $input), 200);
    
    
                    }
    
                }
                catch (\Exception $e) {
                    return Response::json($e->getMessage(), 500);
                }


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
        //
    }

    public function getLugares(){
        try{

            $municipios = Municipio::orderBy('nombre');
            $localidades = Localidad::orderBy("nombre");



            $catalogo_lugares = [
                'municipios'               => $municipios->get(),
                'localidades'              => $localidades->get(),
            ];

            return response()->json($catalogo_lugares, HttpResponse::HTTP_OK);
        }catch(\Exception $e){
            return response()->json(['error'=>['message'=>$e->getMessage(),'line'=>$e->getLine()]], HttpResponse::HTTP_CONFLICT);
        }
    }


    public function getDispositivosPacientes(Request $request){

        //en un futuro mandaria un array de folios para casarlos con los pacientes ingresado que sean distintos de los que mande migue.

        try{
            
            //$parametros = Input::all();
            $parametros = $request->all();
            //return Response::json(array("error" => $parametros['pacientes'], 200));

            //$parametros = (object) $parametros;

            //return Response::json(array("error" => $parametros['pacientes'][1]['folios_paciente'], 200));
            //$arreglos = implode(",", $parametros->pacientes[1]['folios_paciente']);
            //$nuevo = str_replace(array(","), '\",\"', $arreglos);

            
            //return Response::json(array("error" => $nuevo, 200));
            //$pacientes = Paciente::where('clues', $parametros['clues'])->get();
            $pacientes = DB::table('pacientes')
                        ->where('clues', '=', $parametros['pacientes'][0]['clues'])
                        ->where('tieneAlta', '=', 0)
                        ->whereNotIn('folio_paciente', $parametros['pacientes'][1]['folios_pacientes'])
                        ->get();

            if(!$pacientes){
                return Response::json(array("status" => 204, "messages" => "No hay pacientes por sincronizar", "pacientes" => $pacientes), 204);
                //204
            }
                
            
            return Response::json(array("status" => 200, "messages" => "Sincronización Exitosa", "pacientes" => $pacientes), 200);

        }catch(\Exception $e){
            return response()->json(['error'=>['message'=>$e->getMessage(),'line'=>$e->getLine()]], HttpResponse::HTTP_CONFLICT);
        }

    }

}
