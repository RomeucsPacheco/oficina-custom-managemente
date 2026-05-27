package com.example.demo.controller;

import com.example.demo.model.*;      
import com.example.demo.repository.*; 
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/veiculos")
@CrossOrigin(origins = "*")
public class VeiculoController {

    @Autowired
    private VeiculoRepository veiculoRepository;

    // GET: http://localhost:8080/api/veiculos
    @GetMapping
    public List<Veiculo> listarTodos() {
        return veiculoRepository.findAll();
    }

    // POST: http://localhost:8080/api/veiculos
    @PostMapping
    public ResponseEntity<Veiculo> criarVeiculo(@RequestBody Veiculo veiculo) {
        if (veiculo.getCliente() == null || veiculo.getCliente().getId() == null) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
        Veiculo novoVeiculo = veiculoRepository.save(veiculo);
        return new ResponseEntity<>(novoVeiculo, HttpStatus.CREATED);
    }

    // PUT: http://localhost:8080/api/veiculos/{id} (Editar)
    @PutMapping("/{id}")
    public ResponseEntity<Veiculo> editar(@PathVariable Long id, @RequestBody Veiculo dadosAtualizados) {
        return veiculoRepository.findById(id).map(veiculo -> {
            veiculo.setMarca(dadosAtualizados.getMarca());
            veiculo.setModelo(dadosAtualizados.getModelo());
            veiculo.setAno(dadosAtualizados.getAno());
            veiculo.setPlaca(dadosAtualizados.getPlaca());
            if (dadosAtualizados.getCliente() != null) {
                veiculo.setCliente(dadosAtualizados.getCliente());
            }
            Veiculo atualizado = veiculoRepository.save(veiculo);
            return ResponseEntity.ok(atualizado);
        }).orElse(ResponseEntity.notFound().build());
    }

    // DELETE: http://localhost:8080/api/veiculos/{id} (Excluir)
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> excluir(@PathVariable Long id) {
        if (veiculoRepository.existsById(id)) {
            veiculoRepository.deleteById(id);
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }
}