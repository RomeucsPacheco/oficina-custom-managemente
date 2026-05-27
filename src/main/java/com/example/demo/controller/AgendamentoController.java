package com.example.demo.controller;

import com.example.demo.model.*;      
import com.example.demo.repository.*; 
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/agendamentos")
@CrossOrigin(origins = "*")
public class AgendamentoController {

    @Autowired
    private AgendamentoRepository agendamentoRepository;

    @GetMapping
    public List<Agendamento> listarTodos() {
        return agendamentoRepository.findAll();
    }

    @PostMapping
    public ResponseEntity<Agendamento> criarAgendamento(@RequestBody Agendamento agendamento) {
        if (agendamento.getVeiculo() == null || agendamento.getServico() == null || agendamento.getDataAgendamento() == null) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
        Agendamento novoAgendamento = agendamentoRepository.save(agendamento);
        return new ResponseEntity<>(novoAgendamento, HttpStatus.CREATED);
    }

    // PUT: http://localhost:8080/api/agendamentos/{id} (Editar)
    @PutMapping("/{id}")
    public ResponseEntity<Agendamento> editar(@PathVariable Long id, @RequestBody Agendamento dadosAtualizados) {
        return agendamentoRepository.findById(id).map(agendamento -> {
            agendamento.setDataAgendamento(dadosAtualizados.getDataAgendamento());
            agendamento.setStatus(dadosAtualizados.getStatus());
            agendamento.setObservacoes(dadosAtualizados.getObservacoes());
            if (dadosAtualizados.getVeiculo() != null) agendamento.setVeiculo(dadosAtualizados.getVeiculo());
            if (dadosAtualizados.getServico() != null) agendamento.setServico(dadosAtualizados.getServico());
            Agendamento atualizado = agendamentoRepository.save(agendamento);
            return ResponseEntity.ok(atualizado);
        }).orElse(ResponseEntity.notFound().build());
    }

    // DELETE: http://localhost:8080/api/agendamentos/{id} (Excluir)
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> excluir(@PathVariable Long id) {
        if (agendamentoRepository.existsById(id)) {
            agendamentoRepository.deleteById(id);
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }
}