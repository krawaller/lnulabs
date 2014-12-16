##Idiomatisk (eller snarare Davidig) implementering av Memory

Se labben live [här](http://blog.krawaller.se/lnulabs/memory). Labbinstruktionen finns [här](https://github.com/Leitet/Kursmaterial-JavaScript/blob/master/lab/memory.md).

Tog mig friheten att slänga in Underscore för att fixa med initieringen av arrayen.

Har ignorerat kravet på att man inte ska kunna vända upp ny bricka innan felaktigt par vänts tillbaka (känns mer intuitivt att inte behöva vänta), men däremot sett till att man inte kan kludda med dem.

Strukturen följer de andra labbarna - en objektliteral med state och metoder som manipulerar detta state, samt hänvisningar till DOM-noder som också har metoder som click handlers.