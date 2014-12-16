##Idiomatisk (eller snarare Davidig) implementering av Labby Mezzage

Se labben live [här](http://blog.krawaller.se/lnulabs/labbymezzage). Labbinstruktionen finns [här](http://orion.lnu.se/pub/education/course/1DV403/ht12-2/laboration/L02/Laboration%202%20-%20Labby%20Mezzage.pdf).

Jag har bortsett från instruktionen att alla meddelanden ska vara klassinstanser. I JS ligger det ofta närmare till hands att använda statiska funktioner, så som i min lösning.

För att koden inte ska bli alltför bloated när vi bygger element så har jag använt en liten helper-function `create`. I övrigt består appen av en enda objektliteral, där `init`-metoden körs vid initialisering. Den bygger upp noder för formulär och lista, samt sätter event-listeners (som alla är metoder på objektliteralen). Listan av meddelanden, som är vår enda state, levandehålls i en array på literalen.

När UI:t initialt byggs upp så behåller jag också referenser till de noder vi senare behöver komma åt (listan, formuläret). Dessa referenser lagras också på literalen.