# Greenways OS product architecture

Greenways OS is the composition and authority layer. The product surfaces are
implemented as Tahto and Hestia abstractions, packaged with Hara and run in
the environments that each feature requires.

```text
Greenways OS surfaces
  Fabric · Search · Timeline · Cowork · Spaces
                |
  Tahto / Hestia abstractions
                |
  Hara packages and contracts
                |
  Hoplite · Ignatius · Hodos · local runtimes
```

Hoplite and Ignatius are execution environments. Hodos materialises approved
client packages. Greenways OS controls custody, consent, lifecycle and local
capability enforcement; it does not become the owner of Tahto or Hestia
domain meaning.

## Surface gate

Each surface needs a product interaction model, a Tahto/Hestia abstraction,
an Hara package boundary, an execution-environment mapping, authority rules,
recovery semantics and conformance fixtures before Greenways OS implementation
can begin.

The Visual Language atlas is the current top-layer prototype. The Tahto,
Hestia, Hara, Hoplite, Ignatius and Hodos contracts are the bottom-layer
architecture gate.
