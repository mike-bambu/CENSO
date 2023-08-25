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
use App\Models\Sistema\Embarazo;
use App\Models\Sistema\Seguimiento;
use App\Models\Sistema\Diagnostico;
use App\Models\Sistema\SeguimientoDiagnostico;

use App\Models\Catalogos\Clue;
use App\Models\Catalogos\EstadoActual;

use App\Models\Catalogos\Municipio;
use App\Models\Catalogos\Localidad;





class IngresosWebController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {

        $actual = Carbon::today()->toDateString();
        $hoy = Carbon::parse($actual)->format('Y-m-d');

        $parametros = $request->all();
        $usuario = auth()->userOrFail();

        $permiso_todos = DB::table('permissions')
        ->leftJoin('permission_user', 'permissions.id', '=', 'permission_user.permission_id')
        ->where('permission_user.user_id', '=', $usuario->id)
        ->where('permission_user.permission_id', '=', 'P5gCJH25AeIwy2IOmvCYtHKg5XL3hKd0')
        ->first();

        $userClues = DB::table('clue_user')
        ->where('user_id', $usuario->id)->first();

        $userServicio = DB::table('servicio_user')
        ->where('user_id', $usuario->id)->first();

        try{

            $pacientes = "";

            // $pacientes = Paciente::select('pacientes.*')
            // ->with('municipio', 'localidad', 'pais_origen', 'estado_republica', 'atenciones.seguimientos', 'atenciones.alta', 'ultimaAtencion.ultimoSeguimiento')
            // ->where('tieneAtencion', '=', 0)
            // ->orderBy('created_at', 'DESC');
                

            //Filtros, busquedas, ordenamiento
            if(isset($parametros['query']) && $parametros['query']){

                $pacientes = Paciente::select('pacientes.*')
                ->with('municipio', 'localidad', 'pais_origen', 'estado_republica', 'embarazo', 'atenciones.seguimientos', 'atenciones.alta', 'ultimaAtencion.ultimoSeguimiento')
                ->where('tieneAtencion', '=', 0)
                ->orderBy('created_at', 'DESC');

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

            if(isset($parametros['curp']) && $parametros['curp']){

                $paciente = Paciente::select('pacientes.*')
                ->with('municipio', 'localidad', 'pais_origen', 'estado_republica', 'embarazo', 'atenciones.seguimientos', 'atenciones.alta', 'ultimaAtencion.ultimoSeguimiento')
                ->where('curp', '=', $parametros['curp'])
                ->first();


                if($paciente->tieneAtencion == 1){

                    return response()->json(['error'=>'¡El paciente que busca tiene una Atención abierta!'], HttpResponse::HTTP_CONFLICT);

                }
                else{

                    $paciente_on[] = $paciente->toArray();
                    return response()->json(['data'=>$paciente_on],HttpResponse::HTTP_OK);
                }


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

                //     $f = Carbon::parse( $parametros['fecha_ingreso'] )->format('Y-m-d');
                //     $pacientes = $pacientes->where('fecha_ingreso',$f);

                // }

                if(isset($parametros['fecha_inicio'], $parametros['fecha_fin'])){

                    $pacientes = $pacientes->whereBetween(DB::raw('DATE(created_at)'), [$parametros['fecha_inicio'], $parametros['fecha_fin']]);

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


                // if(isset($parametros['diagnosticos']) && $parametros['diagnosticos']){

                //     $pacientes = $pacientes->join('seguimientos as SDP', 'SDP.paciente_id', '=', 'pacientes.id')
                //                            ->join('seguimiento_diagnostico as SD', 'SD.seguimiento_id', '=', 'SDP.id')
                //                            ->join('diagnosticos as D', 'SD.diagnostico_id', '=', 'D.id')
                //                            ->where('SD.diagnostico_id', $parametros['diagnosticos'])->distinct();
                // }
            }

            if(isset($parametros['page'])){

                $resultadosPorPagina = isset($parametros["per_page"]) ? $parametros["per_page"] : 20;

                if (!empty($pacientes)) {

                    $pacientes = $pacientes->paginate($resultadosPorPagina);

                }
                
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
            $data_embarazo = $data['embarazo'];

            $validation_rules = [

                'numero_expediente' => 'nullable|unique:pacientes',
                'curp'              => 'nullable|unique:pacientes',
            ];
        
            $validation_eror_messajes = [

                //'curp.required' => 'La captura de la CURP es Obligatoria.',
                //'curp.unique'   => 'La CURP ya se encuentra registrada con otro Paciente.',

                'numero_expediente.unique'      =>  'El Paciente que intenta ingresar con este Número de Expediente ya existe, favor de buscarlo en la lista del módulo de Ingresos…',
                'curp.unique'                   =>  'El Paciente que intenta ingresa ya existe, favor de buscarlo en la lista del módulo de Ingresos…'
                
            ];
            

            $resultado = Validator::make($data_paciente,$validation_rules,$validation_eror_messajes);

            if ($resultado->fails()) {
                return response()->json(['mensaje' => 'Error en los datos del formulario', 'validacion'=>$resultado->passes(), 'errores'=>$resultado->errors()], HttpResponse::HTTP_CONFLICT);
            }else{


                if (is_array($data_paciente))
                $data_paciente = (object) $data_paciente;

                if (is_array($data_atencion))
                $data_atencion = (object) $data_atencion;

                if (is_array($data_embarazo))
                $data_embarazo = (object) $data_embarazo;
        
                try {


                            if($data_paciente->tieneAtencion == 0){

                                $paciente = new Paciente();

                                $paciente->folio_paciente           = mb_strtoupper($data_paciente->folio_paciente, 'UTF-8');
                                $paciente->numero_expediente        = mb_strtoupper($data_paciente->numero_expediente, 'UTF-8');
                                $paciente->tieneAtencion            = $data_paciente->tieneAtencion;
                                $paciente->nombre                   = mb_strtoupper($data_paciente->nombre, 'UTF-8');
                                $paciente->paterno                  = mb_strtoupper($data_paciente->paterno, 'UTF-8');
                                $paciente->materno                  = mb_strtoupper($data_paciente->materno, 'UTF-8');
                                $paciente->tipo_edad                = $data_paciente->tipo_edad;
                                $paciente->edad                     = $data_paciente->edad;
                                $paciente->edad_aparente            = $data_paciente->edad_aparente; 
                                $paciente->sexo                     = $data_paciente->sexo;            
                                $paciente->fecha_nacimiento         = Carbon::parse($data_paciente->fecha_nacimiento)->format('Y-m-d');
                                $paciente->curp                     = property_exists($data_paciente, "curp") ? mb_strtoupper($data_paciente->curp, 'UTF-8') : NULL;
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

                            }elseif($data_paciente->tieneAtencion == 1 ){

                                    $paciente = new Paciente();

                                    $paciente->folio_paciente           = $data_paciente->folio_paciente;
                                    $paciente->numero_expediente        = $data_paciente->numero_expediente;
                                    $paciente->tieneAtencion            = $data_paciente->tieneAtencion;
                                    $paciente->nombre                   = mb_strtoupper($data_paciente->nombre, 'UTF-8');
                                    $paciente->paterno                  = mb_strtoupper($data_paciente->paterno, 'UTF-8');
                                    $paciente->materno                  = mb_strtoupper($data_paciente->materno, 'UTF-8');
                                    $paciente->tipo_edad                = $data_paciente->tipo_edad;
                                    $paciente->edad                     = $data_paciente->edad;
                                    $paciente->edad_aparente            = $data_paciente->edad_aparente; 
                                    $paciente->sexo                     = $data_paciente->sexo;            
                                    $paciente->fecha_nacimiento         = Carbon::parse($data_paciente->fecha_nacimiento)->format('Y-m-d');
                                    $paciente->curp                     = property_exists($data_paciente, "curp") ? mb_strtoupper($data_paciente->curp, 'UTF-8') : NULL;
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
            
                                    if( $paciente->save() ){

                                        $atencion = new Atencion();

                                        $atencion->folio_atencion              = mb_strtoupper($data_atencion->folio_atencion, 'UTF-8');
                                        $atencion->esAmbulatoria               = $data_atencion->esAmbulatoria;
                                        $atencion->dadodeAlta                  = $data_atencion->dadodeAlta;
                                        $atencion->esUrgenciaCalificada        = $data_atencion->esUrgenciaCalificada;
                                        $atencion->fecha_inicio_atencion       = Carbon::parse($data_atencion->fecha_inicio_atencion)->format('Y-m-d');   
                                        $atencion->hora                        = $data_atencion->hora;
                                        $atencion->estado_actual_id            = $data_atencion->estado_actual_id;
                                        $atencion->servicio_id                 = $data_atencion->servicio_id;
                                        $atencion->cama_id                     = $data_atencion->cama_id;
                                        $atencion->no_cama                     = property_exists($data_atencion, "no_cama") ? $data_atencion->no_cama: $atencion->no_cama;
                                        $atencion->motivo_atencion             = mb_strtoupper($data_atencion->motivo_atencion, 'UTF-8');;
                                        $atencion->indicaciones                = mb_strtoupper($data_atencion->indicaciones, 'UTF-8');
                                        $atencion->estaEmbarazada              = $data_atencion->estaEmbarazada;
                                        $atencion->haEstadoEmbarazada          = $data_atencion->haEstadoEmbarazada;
                                        $atencion->codigoMater                 = $data_atencion->codigoMater;
                                        $atencion->clues_id                    = $data_atencion->clues_id;
                                        $atencion->paciente_id                 = $paciente->id;

                                        $atencion->ultimo_servicio_id          = $data_atencion->servicio_id;
                                        $atencion->ultima_cama_id              = $data_atencion->cama_id;
                                        $atencion->ultimo_no_cama              = property_exists($data_atencion, "no_cama") ? $data_atencion->no_cama: $atencion->no_cama;
                                        $atencion->ultimo_estado_actual_id     = $data_atencion->estado_actual_id;
                                        //se manda ultimo_factor_covid_id por que no se considera en la atencion de inicio
                                        $atencion->ultimo_factor_covid_id      = $data_atencion->ultimo_factor_covid_id;


    
                                    if($atencion->save()){
    
                                            DB::table('camas')
                                            ->where('id', $data_atencion->cama_id)
                                            ->where('servicio_id', $data_atencion->servicio_id)
                                            ->update([
                                                'estatus_cama_id'        => 3,
                                            ]);
    
                                       

                                        if( $data_paciente->sexo === 'Femenino' && $data_atencion->estaEmbarazada == 1 || $data_atencion->haEstadoEmbarazada !== null ){

                                                $embarazo = new Embarazo();

                                                $embarazo->fueReferida                       = $data_embarazo->fueReferida                   ;
                                                $embarazo->gestas                            = $data_embarazo->gestas                        ;
                                                $embarazo->partos                            = $data_embarazo->partos                        ;
                                                $embarazo->cesareas                          = $data_embarazo->cesareas                      ;
                                                $embarazo->abortos                           = $data_embarazo->abortos                       ;
                                                $embarazo->fecha_ultima_mestruacion          = $data_embarazo->fecha_ultima_mestruacion;
                                                $embarazo->fecha_control_embarazo            = $data_embarazo->fecha_control_embarazo;
                                                $embarazo->semanas_gestacionales             = $data_embarazo->semanas_gestacionales         ;
                                                $embarazo->fecha_ultimo_parto                = $data_embarazo->fecha_ultimo_parto;
                                                $embarazo->puerperio                         = $data_embarazo->puerperio;
                                                $embarazo->metodo_gestacional_id             = $data_embarazo->metodo_gestacional_id         ;
                                                $embarazo->clues_referencia_id               = $data_embarazo->clues_referencia_id           ;
                                                $embarazo->clue_atencion_embarazo_id         = $data_embarazo->clue_atencion_embarazo_id     ;
                                                $embarazo->fecha_ultima_atencion_embarazo    = $data_embarazo->fecha_ultima_atencion_embarazo;
                                                $embarazo->clues_control_embarazo_id         = $data_embarazo->clues_control_embarazo_id     ;
                                                $embarazo->paciente_id                       = $paciente->id;

                                                $embarazo->save();

                                        }

                                    }

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

        $paciente = Paciente::with('municipio','localidad', 'estado_republica', 'pais_origen', 'atenciones', 'ultimaAtencion')->find($id);

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
                'id.required'                => 'El ID es requerido.',
                'id.unique'                  => 'El ID debe ser único.',
                'curp.unique'                => 'La CURP ya se encuentra registrada con otro Paciente.',
                'numero_expediente.unique'   => 'El Número de Expediente ya existe con un Paciente asignado.',
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
    
                            $paciente->folio_paciente           = mb_strtoupper($data_paciente->folio_paciente, 'UTF-8');
                            $paciente->numero_expediente        = mb_strtoupper($data_paciente->numero_expediente, 'UTF-8');
                            $paciente->tieneAtencion            = $data_paciente->tieneAtencion;
                            $paciente->nombre                   = mb_strtoupper($data_paciente->nombre, 'UTF-8');
                            $paciente->paterno                  = mb_strtoupper($data_paciente->paterno, 'UTF-8');
                            $paciente->materno                  = mb_strtoupper($data_paciente->materno, 'UTF-8');
                            $paciente->edad                     = $data_paciente->edad;
                            $paciente->tipo_edad                = $data_paciente->tipo_edad;
                            $paciente->edad_aparente            = $data_paciente->edad_aparente; 
                            $paciente->sexo                     = $data_paciente->sexo;            
                            $paciente->fecha_nacimiento         = Carbon::parse($data_paciente->fecha_nacimiento)->format('Y-m-d');
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
