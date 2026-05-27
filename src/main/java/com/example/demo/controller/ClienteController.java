package com.example.demo.controller;

import com.example.demo.model.*;      
import com.example.demo.repository.*; 
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/clientes")
@CrossOrigin(origins = "*") // Crucial: Permite que seu frontend HTML/JS converse com a API
public class ClienteController {

    @Autowired
    private ClienteRepository clienteRepository;

    // GET: http://localhost:8080/api/clientes
    @GetMapping
    public List<Cliente> listarTodos() {
        return clienteRepository.findAll();
    }

    // POST: http://localhost:8080/api/clientes
    @PostMapping
    public ResponseEntity<Cliente> criarCliente(@RequestBody Cliente cliente) {
        if (cliente.getNome() == null || cliente.getNome().isEmpty()) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
        Cliente novoCliente = clienteRepository.save(cliente);
        return new ResponseEntity<>(novoCliente, HttpStatus.CREATED);
    }

    // PUT: http://localhost:8080/api/clientes/{id} (Editar)
    @PutMapping("/{id}")
    public ResponseEntity<Cliente> editar(@PathVariable Long id, @RequestBody Cliente dadosAtualizados) {
        return clienteRepository.findById(id).map(cliente -> {
            cliente.setNome(dadosAtualizados.getNome());
            cliente.setTelefone(dadosAtualizados.getTelefone());
            cliente.setEmail(dadosAtualizados.getEmail());
            Cliente atualizado = clienteRepository.save(cliente);
            return ResponseEntity.ok(atualizado);
        }).orElse(ResponseEntity.notFound().build());
    }

    // DELETE: http://localhost:8080/api/clientes/{id} (Excluir)
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> excluir(@PathVariable Long id) {
        if (clienteRepository.existsById(id)) {
            clienteRepository.deleteById(id);
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }
}