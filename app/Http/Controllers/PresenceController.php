<?php

namespace App\Http\Controllers;

use App\Models\Presence;
use Exception;
use Illuminate\Http\Request;

class PresenceController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $idParticipant = $request->input('idParticipant');

        return Presence::select('id', 'data', 'idParticipant')
            ->where('idParticipant', '=', $idParticipant)
            ->orderBy('data', 'ASC')->get();
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'data'=>'required|date',
            'idParticipant'=>'required',
        ]);

        try{
            $exists = Presence::select('data', 'idParticipant')
                ->whereDate('data', '=', $request->data)
                ->where('idParticipant', '=', $request->idParticipant)->count();
            if($exists > 0) {
                throw new \Exception('Presença já confirmada na data selecionada');
            }

            Presence::create($request->post());

            return response()->json([
                'message'=>'Presença Criada com Sucesso.'
            ],200);
        }catch(\Exception $e){
            return response()->json([
                'message'=>'Ocorreu um erro ao salvar presença. '. $e->getMessage()
            ],500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(Presence $presence)
    {
        return response()->json([
            'presence'=>$presence
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Presence $presence)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update()
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Presence $presence)
    {
        try{
            $presence->delete();

            return response()->json([
                'message'=>'Presença excluída com Sucesso.'
            ]);
        }catch(\Exception $e){
            return response()->json([
                'message'=>'Ocorreu um erro ao excluir presença.'
            ],500);
        }
    }
}
