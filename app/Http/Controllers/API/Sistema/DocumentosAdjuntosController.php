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
use App\Models\Sistema\DocumentoAdjunto;





class DocumentosAdjuntosController extends Controller
{

    public function store(Request $request) {

        //$data = Input::json()->all();
        $data = $request->all();
        $data = (object) $data;


        try {

            if(property_exists($data, "documentos")){
                $documentos = array_filter($data->documentos, function($v){return $v !== null;});
                foreach ($documentos as $key => $value) {
                    //validar que el valor no sea null
                    if($value != null){
                        //comprobar si el value es un array, si es convertirlo a object mas facil para manejar.
                        if(is_array($value))
                            $value = (object)$value;

                            if($paciente = Paciente::where('folio_paciente', '=', $value->paciente_id)->first()){

                                $documento = new DocumentoAdjunto();

                                $documento->url_documento                   = $value->url_documento;
                                $documento->extension_documento             = $value->extension_documento;
                                $documento->paciente_id                     = $paciente->id;
        
                                $documento->save();
                            }
                    }
                }
                return Response::json(array("status" => 200, "messages" => "Se agregaron los documentos del paciente con exito", "data" => $data), 200);
            }
            else{
                return Response::json(array("error" => 404, "messages" => "No se registraron los documentos"), 404);
            }
        }
        catch (\Exception $e) {
            return Response::json($e->getMessage(), 500);
        }


    }

}