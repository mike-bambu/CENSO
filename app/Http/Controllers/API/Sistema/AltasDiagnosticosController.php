<?php

namespace App\Http\Controllers\API\Sistema;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
//use Illuminate\Support\Facades\Input;
use Response, DB;


use App\Models\Sistema\Paciente;
use App\Models\Sistema\Alta;
use App\Models\Sistema\AltaDiagnostico;

class AltasDiagnosticosController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        //
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        //$data = Input::json()->all();
        $data = $request->json()->all();
        $data = (object) $data;

        try {

            if(property_exists($data, "alta_diagnosticos")){
                $alta_diagnosticos = array_filter($data->alta_diagnosticos, function($v){return $v !== null;});
                foreach ($alta_diagnosticos as $key => $value) {
                    //validar que el valor no sea null
                    if($value != null){
                        //comprobar si el value es un array, si es convertirlo a object mas facil para manejar.
                        if(is_array($value))
                            $value = (object) $value;

                                if($alta = Alta::where('folio_alta', '=', $value->folio_alta)->first()){
                                    
                                    $diagnosticos = new AltaDiagnostico();

                                    $diagnosticos->folio_alta_diagnostico                      = $value->folio_alta_diagnostico;
                                    $diagnosticos->alta_id                                     = $alta->id;
                                    $diagnosticos->diagnostico_id                              = $value->diagnostico_id;
                                    
                                    $diagnosticos->save();
                                }

                    }
                }
                return Response::json(array("status" => 200, "messages" => "Se agrego la información de los diagnoticos en el alta con exito", "data" => $data), 200);
            }
            else{
                return Response::json(array("error" => 404, "messages" => "No se registraron los diagnosticos en el alta"), 404);
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
        //
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
