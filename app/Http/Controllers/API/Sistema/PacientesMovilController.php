<?php

namespace App\Http\Controllers\API\Sistema;

use Illuminate\Http\Request;
use Illuminate\Http\Response as HttpResponse;

//use Illuminate\Support\Facades\Input;
use Illuminate\Support\Facades\Hash;

use App\Http\Controllers\Controller;

use Illuminate\Support\Facades\DB;

use Illuminate\Database\Eloquent\Collection;

use Response, Validator;

use Carbon\Carbon;

use App\Models\Sistema\Paciente;
use App\Models\Sistema\Seguimiento;
use App\Models\Sistema\Atencion;
use App\Models\Sistema\Alta;
use App\Models\Sistema\Diagnostico;
use App\Models\Sistema\SeguimientoDiagnostico;

use App\Models\Catalogos\Clue;
use App\Models\Catalogos\EstadoActual;

use App\Models\Catalogos\Camas;

use App\Models\Catalogos\Municipio;
use App\Models\Catalogos\Localidad;





class PacientesMovilController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {

        try{

            $loggedUser = auth()->userOrFail();

            $permiso = DB::table('permissions')
                ->leftJoin('permission_user', 'permissions.id', '=', 'permission_user.permission_id')
                ->where('permission_user.user_id', '=', $loggedUser->id)
                ->where('permission_user.permission_id', '=', 'P5gCJH25AeIwy2IOmvCYtHKg5XL3hKd0')
                ->first();
    
                //P5gCJH25AeIwy2IOmvCYtHKg5XL3hKd0
    
            $userClues = DB::table('clue_user')
            ->where('user_id', $loggedUser->id)->first();

            

            if($permiso){

                $pacientes = Paciente::select('pacientes.*')
                ->with('seguimientos.diagnosticos', 'clues', 'municipio', 'localidad', 'metodo_gestacional', 'alta')->orderBy('fecha_ingreso', 'DESC');

            }else{

                $pacientes = Paciente::select('pacientes.*')
                ->with('seguimientos.diagnosticos', 'clues', 'municipio', 'localidad', 'metodo_gestacional', 'alta')->orderBy('fecha_ingreso', 'DESC');

                $pacientes->where('clues', '=', $userClues->clue_id);
            }


            //$parametros = Input::all();
            $parametros = $request->all();

            //$pacientes->where('clues', '=', $userClues->clue_id);
            //$pacientes = Paciente::select('pacientes.*','seguimientos', 'municipio', 'localidad', 'metodo_gestacional', 'afiliacion')

            //Filtros, busquedas, ordenamiento
            if(isset($parametros['query']) && $parametros['query']){
                $pacientes = $pacientes->where(function($query)use($parametros){
                    return $query->where('folio_paciente','LIKE','%'.$parametros['query'].'%')
                                ->orWhere('clues','LIKE','%'.$parametros['query'].'%')
                                ->orWhere('nombre','LIKE','%'.$parametros['query'].'%')
                                ->orWhere('paterno','LIKE','%'.$parametros['query'].'%')
                                ->orWhere('materno','LIKE','%'.$parametros['query'].'%');
                });
            }

            if(isset($parametros['active_filter']) && $parametros['active_filter']){

                // if(isset($parametros['fecha_ingreso']) && $parametros['fecha_ingreso']){

                //     $f = Carbon::createFromDate( $parametros['fecha_ingreso'] )->format('Y-m-d');
                //     $pacientes = $pacientes->where('fecha_ingreso',$f);

                // }

                if(isset($parametros['fecha_inicio'], $parametros['fecha_fin'])){

                    $pacientes = $pacientes->whereBetween('fecha_ingreso', [$parametros['fecha_inicio'], $parametros['fecha_fin']]);

                }

                if(isset($parametros['altas'])){

                    $pacientes = $pacientes->where('tieneAlta',$parametros['altas']);

                }

                if(isset($parametros['nombre']) && $parametros['nombre']){

                    $pacientes = $pacientes->where('nombre',$parametros['nombre'])
                                           ->orWhere('paterno',$parametros['nombre'])
                                           ->orWhere('materno',$parametros['nombre']);
                }

                if(isset($parametros['clues']) && $parametros['clues']){

                    $pacientes = $pacientes->where('clues',$parametros['clues']);

                    //POR SI SE QUIERE BUSCAR EL FRANGMENTO DE UNA CADENA O STRING
                    // $pacientes = $pacientes->where(DB::raw('SUBSTRING(pacientes.folio_paciente, 1, 11)'), '=' , $parametros['clues']);
                }

                if(isset($parametros['estados_actuales']) && $parametros['estados_actuales']){

                    //$pacientes = $pacientes->join( DB::raw("(SELECT MAX('seguimientos.id') FROM seguimientos WHERE seguimientos.paciente_id = pacientes.id )"), 'seguimientos.paciente_id', '=', 'pacientes.id')
                                           //->select('nombre',DB::raw('max(S.id) from seguimientos'))
                                           //->where(DB::raw("(select max(`S.id`) from seguimientos)") )
                                           //->where('seguimientos.estado_actual_id', $parametros['estados_actuales']);

                    // $pacientes = $pacientes->join('seguimientos as SEAP', 'SEAP.paciente_id', '=', 'pacientes.id')
                    //                        ->where('SEAP.estado_actual_id', $parametros['estados_actuales'])->distinct();

                    $pacientes = $pacientes->where('estado_actual_id',$parametros['estados_actuales']);


                }

                if(isset($parametros['diagnosticos']) && $parametros['diagnosticos']){

                    $pacientes = $pacientes->join('seguimientos as SDP', 'SDP.paciente_id', '=', 'pacientes.id')
                                           ->join('seguimiento_diagnostico as SD', 'SD.seguimiento_id', '=', 'SDP.id')
                                           ->join('diagnosticos as D', 'SD.diagnostico_id', '=', 'D.id')
                                           ->where('SD.diagnostico_id', $parametros['diagnosticos'])->distinct();
                }
            }

            if(isset($parametros['page'])){
                $resultadosPorPagina = isset($parametros["per_page"])? $parametros["per_page"] : 20;
    
                $pacientes = $pacientes->paginate($resultadosPorPagina);
            } else {
                $pacientes = $pacientes->get();
            }

            return response()->json(['data'=>$pacientes],HttpResponse::HTTP_OK);
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

        //$data = Input::json()->all();
        $data = $request->all();
        $data = (object) $data;

        
        

        try {

            if(property_exists($data, "pacientes")){
                $pacientes = array_filter($data->pacientes, function($v){return $v !== null;});
                foreach ($pacientes as $key => $value) {
                    //validar que el valor no sea null
                    if($value != null){
                        //comprobar si el value es un array, si es convertirlo a object mas facil para manejar.
                        if(is_array($value))
                            $value = (object)$value;
                            $paciente = new Paciente();

                            $paciente->folio_paciente           = mb_strtoupper($value->folio_paciente, 'UTF-8');
                            $paciente->numero_expediente        = mb_strtoupper($value->numero_expediente, 'UTF-8');
                            $paciente->nombre                   = mb_strtoupper($value->nombre, 'UTF-8');
                            $paciente->paterno                  = mb_strtoupper($value->paterno, 'UTF-8'); 
                            $paciente->materno                  = mb_strtoupper($value->materno, 'UTF-8');       
                            $paciente->edad                     = $value->edad;
                            $paciente->edad_aparente            = $value->edad_aparente;            
                            $paciente->sexo                     = $value->sexo;            
                            $paciente->fecha_nacimiento         = Carbon::createFromDate($value->fecha_nacimiento)->format('Y-m-d');
                            $paciente->curp                     = mb_strtoupper($value->curp, 'UTF-8');
                            $paciente->estado_republica_id      = $value->estado_republica_id; 
                            $paciente->municipio_id             = $value->municipio_id;    
                            $paciente->localidad_id             = $value->localidad_id;    
                            $paciente->esDesconocido            = $value->esDesconocido;   
                            $paciente->alias                    = mb_strtoupper($value->alias, 'UTF-8');        
                            $paciente->esExtranjero             = $value->esExtranjero;    
                            $paciente->pais_origen_id           = $value->pais_origen_id;  
                            $paciente->telefono_emergencia            = $value->telefono_emergencia;   
                            $paciente->telefono_celular         = $value->telefono_celular;
                            $paciente->calle                    = mb_strtoupper($value->calle, 'UTF-8');           
                            $paciente->colonia                  = mb_strtoupper($value->colonia, 'UTF-8');        
                            $paciente->no_exterior              = $value->no_exterior;     
                            $paciente->no_interior              = $value->no_interior;     
                            $paciente->entreCalles              = mb_strtoupper($value->entreCalles, 'UTF-8');  
                            $paciente->cp                       = $value->cp;              
                            $paciente->user_id                  = $value->user_id;         
    
                            $paciente->save();
                    }
                }
                return Response::json(array("status" => 200, "messages" => "Se agrego la información del paciente con exito", "data" => $data), 200);
            }
            else{
                return Response::json(array("error" => 404, "messages" => "No se registro el paciente"), 404);
            }
        }
        catch (\Exception $e) {
            return Response::json($e->getMessage(), 500);
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

        //$paciente = Paciente::with('municipio','localidad')->find($id);
        $paciente = Paciente::find($id);

        if(!$paciente){
            return response()->json(['No se encuentra el recurso que esta buscando.'], HttpResponse::HTTP_CONFLICT);
            //404
        }

        return response()->json(['paciente' => $paciente], 200);
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

    public function getFilterCatalogs(){
        try{

            $catalogo_clues = Clue::orderBy('nombre');
            $catalogo_diagnosticos = Diagnostico::orderBy("nombre");
            $catalogo_estados_actuales = EstadoActual::orderBy("nombre");



            $catalogos = [
                'clues'               => $catalogo_clues->get(),
                'diagnosticos'        => $catalogo_diagnosticos->get(),
                'estados_actuales'    => $catalogo_estados_actuales->get(),
            ];

            return response()->json(['data'=>$catalogos],HttpResponse::HTTP_OK);
        }catch(\Exception $e){
            return response()->json(['error'=>['message'=>$e->getMessage(),'line'=>$e->getLine()]], HttpResponse::HTTP_CONFLICT);
        }
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
            // $pacientes = DB::table('pacientes as PACI')->with('ultimaAtencion')
            //             ->where('PACI.tieneAtencion', '=', 1)
            //             // ->leftJoin('atenciones as ATEN', 'PACI.id', '=', 'ATEN.paciente_id')
            //             // ->where('ATEN.id', '=', \DB::raw("(select max(`id`) from atenciones)"))
            //             ->where('ATEN.clues_id', '=', $parametros['pacientes'][0]['clues'])
            //             ->where('ATEN.dadodeAlta', '=', 0)
            //             ->whereIn('PACI.folio_paciente', $parametros['pacientes'][1]['folios_pacientes'])
            //             ->get();

            $pacientes = Paciente::select('pacientes.*')->with('ultimaAtencion.ultimoSeguimiento')
                            ->where('tieneAtencion', '=', 1)
                            ->join('atenciones as ATEN', 'pacientes.id', '=', 'ATEN.paciente_id')
                            // ->where('ATEN.id', '=', \DB::raw("(select max(`id`) from atenciones)"))
                            ->where('ATEN.clues_id', '=', $parametros['pacientes'][0]['clues'])
                            ->where('ATEN.dadodeAlta', '=', 0)
                            ->whereNotIn('folio_paciente', $parametros['pacientes'][1]['folios_pacientes'])->distinct()
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

    public function getSincronizarPacientes(Request $request){

        //en un futuro mandaria un array de folios para casarlos con los pacientes ingresado que sean distintos de los que mande migue.

        try{
            
            $parametros = $request->all();

            $pacientes = Paciente::select('pacientes.*')->with('ultimaAtencion.ultimoSeguimiento')
                            ->where('tieneAtencion', '=', 1)
                            ->join('atenciones as ATEN', 'pacientes.id', '=', 'ATEN.paciente_id')
                            ->where('ATEN.clues_id', '=', $parametros['clues'])
                            ->where('ATEN.dadodeAlta', '=', 0)
                            ->get();

            if(!empty($pacientes)){
                return Response::json(array("status" => 200, "messages" => "Sincronización Exitosa", "pacientes" => $pacientes), 200);
            }

        }catch(\Exception $e){
            return response()->json(['error'=>['message'=>$e->getMessage(),'line'=>$e->getLine()]], HttpResponse::HTTP_CONFLICT);
        }

    }

    public function getDispositivosAltas(Request $request){

        //en un futuro mandaria un array de folios para casarlos con los pacientes ingresado que sean distintos de los que mande migue.

        try{
            
            $parametros = $request->all();


            $altas = Alta::select('altas.*')->with('ultimaAtencion')
                            ->join('atenciones as ATEN', 'ATEN.id', '=', 'altas.atencion_id')
                            ->join('pacientes  as PACI', 'PACI.id', '=', 'ATEN.paciente_id')
                            ->where('ATEN.clues_id', '=', $parametros['altas'][0]['clues'])
                            ->where('dadodeAlta', '=', 1)
                            ->whereNotIn('folio_alta', $parametros['altas'][1]['folios_altas'])
                            ->get();

            if(!$altas){
                return Response::json(array("status" => 204, "messages" => "No hay pacientes por sincronizar", "altas" => $altas), 204);
                //204
            }
                
            
            return Response::json(array("status" => 200, "messages" => "Sincronización Exitosa", "altas" => $altas), 200);

        }catch(\Exception $e){
            return response()->json(['error'=>['message'=>$e->getMessage(),'line'=>$e->getLine()]], HttpResponse::HTTP_CONFLICT);
        }

    }



    public function actualizacionCamas(Request $request){


        $data = $request->all();


        $data = (object) $data;        

        try {

            if(property_exists($data, "camas")){
                $camas = array_filter($data->camas, function($v){return $v !== null;});
                foreach ($camas as $key => $value) {
                    //validar que el valor no sea null
                    if($value != null){
                        //comprobar si el value es un array, si es convertirlo a object mas facil para manejar.
                        if(is_array($value))

                            $value = (object)$value;

                                    DB::table('camas')
                                    ->where('id', $value->id)
                                    ->update(
                                        [
                                            'numero'            => $value->no_cama,
                                            'servicio_id'       => $value->id_servicio,
                                            'estatus_cama_id'   => $value->id_status,
                                            "updated_at"        => Carbon::now(),

                                        ]
                                    );


                                    // $camas = Camas::find($value->id);

                                    // $camas->id                  = $value->id;
                                    // $camas->numero              = $value->no_cama;
                                    // $camas->servicio_id         = $value->id_servicio;
                                    // $camas->estatus_cama_id     = $value->id_status;
                                    // $camas->save();

                                    // DB::table('camas')
                                    // ->where('id', $value->id)
                                    // ->update(
                                    //     [
                                    //         'numero'            => $value->no_cama,
                                    //         'servicio_id'       => $value->id_servicio,
                                    //         'estatus_cama_id'   => $value->id_status

                                    //     ]
                                    // );

                                    // $camas = Camas::find($value->id);
                                    // $camas->numero              = $value->no_cama;
                                    // $camas->servicio_id         = $value->id_servicio;
                                    // $camas->estatus_cama_id     = $value->id_status;
                                    // $camas->save();
                    }
                }
                return Response::json(array("status" => 200, "messages" => "Se actualizo la cama con exito", "catalogo_camas" => $camas), 200);
            }
            else{
                return Response::json(array("error" => 404, "messages" => "No se registro el paciente"), 404);
            }
        }
        catch (\Exception $e) {
            return Response::json($e->getMessage(), 500);
        }


    }

}
