package com.example.demo.controller;

import com.example.demo.model.*;      
import com.example.demo.repository.*; 
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/servicos")
@CrossOrigin(origins = "*")
public class ServicoController {

    @Autowired
    private ServicoRepository servicoRepository;

    @GetMapping
    public List<Servico> listarTodos() {
        return servicoRepository.findAll();
    }

    @PostMapping
    public ResponseEntity<Servico> criarServico(@RequestBody Servico servico) {
        if (servico.getNomeServico() == null || servico.getPrecoBase() == null) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
        Servico novoServico = servicoRepository.save(servico);
        return new ResponseEntity<>(novoServico, HttpStatus.CREATED);
    }

    // PUT: http://localhost:8080/api/servicos/{id} (Editar)
    @PutMapping("/{id}")
    public ResponseEntity<Servico> editar(@PathVariable Long id, @RequestBody Servico dadosAtualizados) {
        return servicoRepository.findById(id).map(servico -> {
            servico.setNomeServico(dadosAtualizados.getNomeServico());
            servico.setCategoria(dadosAtualizados.getCategoria());
            servico.setPrecoBase(dadosAtualizados.getPrecoBase());
            servico.setTempoEstimadoHoras(dadosAtualizados.getTempoEstimadoHoras());
            Servico atualizado = servicoRepository.save(servico);
            return ResponseEntity.ok(atualizado);
        }).orElse(ResponseEntity.notFound().build());
    }

    // DELETE: http://localhost:8080/api/servicos/{id} (Excluir)
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> excluir(@PathVariable Long id) {
        if (servicoRepository.existsById(id)) {
            servicoRepository.deleteById(id);
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }
}