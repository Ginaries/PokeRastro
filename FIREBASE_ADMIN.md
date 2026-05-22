# PokeRastro Firebase Admin

## Donde se guarda la partida

Cada jugador tiene un documento en:

```text
saves/{uid}
```

El campo `save` contiene la partida completa para restaurar el juego:

- Pokemon capturados
- niveles, XP, PS y stats individuales
- oro
- mochila completa
- misiones, logros, bitacora
- area activa y progreso general

El mismo documento tambien guarda campos visibles para administrar rapido:

- `userId`
- `gold`
- `steps`
- `captures`
- `defeats`
- `collectionCount`
- `speciesCount`
- `shinyCount`
- `legendaryCount`
- `mythicalCount`
- `highestLevel`
- `activePokemon`
- `strongestPokemon`
- `items`
- `masterBall`
- `ultraBall`
- `rareCandy`

## Como dar premios

Desde el juego, una cuenta admin ve el boton `Admin` y puede buscar usuarios por nombre para enviar oro, Master Ball, Ultra Ball y caramelos raros.

Para hacer admin a una cuenta:

1. Entra una vez con esa cuenta.
2. En Firestore abre `saves` y copia el ID del documento de esa cuenta.
3. Crea un documento en:

```text
admins/{uid}
```

Con:

```js
{
  active: true
}
```

Al volver a iniciar sesion, esa cuenta vera el boton `Admin`.

Tambien puedes crear regalos manualmente en:

```text
grants/{uid}
```

Ejemplo:

```js
{
  grantId: "evento-001",
  gold: 5000,
  items: {
    masterBall: 2,
    rareCandy: 10,
    ultraBall: 5
  }
}
```

Cuando el jugador inicia sesion, el juego aplica el premio, guarda la partida y borra el documento de `grants`.

## Reglas

Publicar `firestore.rules` en Firebase para que cada jugador solo pueda leer/escribir su propia partida.
