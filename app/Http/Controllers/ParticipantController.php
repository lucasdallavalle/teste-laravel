<?php

namespace App\Http\Controllers;

use App\Models\Participant;
use App\Models\Presence;
use Exception;
use Illuminate\Http\Request;

class ParticipantController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $idEvent = $request->input('idEvent');

        $participants = Participant::select('id', 'name', 'document', 'email', 'excluded', 'idEvent')
            ->where('excluded', '=', false)
            ->where('idEvent', '=', $idEvent)
            ->get();
        foreach($participants as $k => $p){
            $participants[$k]['presence'] = Presence::select('data')->where('idParticipant', '=', $p->id)->get();
        }
        return $participants;
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
            'name'=>'required',
            'document'=>'required',
            'email'=>'required|email',
            'idEvent'=>'required'
        ]);

        try{
            $exists = Participant::select('id', 'name', 'document', 'email', 'excluded', 'idEvent')
                ->where('excluded', '=', false)
                ->where('idEvent', '=', $request->idEvent)
                ->where('document', '=', $request->document)->get();
            if(empty($exists)) {
                throw new \Exception('CPF de participante já cadastrado para este evento.');
            }

            Participant::create($request->post());

            return response()->json([
                'message'=>'Participante Criado com Sucesso.'
            ]);
        }catch(\Exception $e){
            return response()->json([
                'message'=>'Ocorreu um erro ao salvar participante. '. $e->getMessage()
            ],500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(Participant $participant)
    {
        return response()->json([
            'participant'=>$participant
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Participant $participant)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Participant $participant)
    {
        $request->validate([
            'name'=>'required',
            'document'=>'required',
            'email'=>'required|email',
            'idEvent'=>'required'
        ]);

        try{
            $participant->fill($request->post())->update();

            return response()->json([
                'message'=>'Participante Atualizado com Sucesso.'
            ]);
        }catch(\Exception $e){
            return response()->json([
                'message'=>'Ocorreu um erro ao atualizar participante.'
            ],500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Participant $participant)
    {
        try{
            $participant->excluded = true;
            $participant->save();

            return response()->json([
                'message'=>'Participante excluído com Sucesso.'
            ]);
        }catch(\Exception $e){
            return response()->json([
                'message'=>'Ocorreu um erro ao excluir participante.'
            ],500);
        }
    }
}
