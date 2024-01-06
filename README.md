**Adresa aplikace:** https://kind-plum-goshawk-cuff.cyclic.app/

Je možné si vytvořit vlastního uživatele s dodžením instrukcí ohledně vytvoření hesla, nebo se přihlásit pomocí již existujícího uživatele (email: name@example.com, heslo: user0123/). 

(ps. občas to ze začátku dělalo blbosti při prvním login/sign up, ale jelikož se to už neobjevilo, tak jsem neměl možnost zjistit proč to nefungovalo (refresh fixes everything))

**JSON formát:** https://kind-plum-goshawk-cuff.cyclic.app/json

Data JSON formátu jsou k zobrazení po kliknutí na tlačítko s textem JSON data. Pro zobrazení dat ve formátu JSON je nutné aby byl uživatel přihlášen. (V kódu jsem chtěl využít process.env... pro adresu přímo ale )

### Zabezpečení - ošetření vstupu
Pro ošetření vstupu se používá funce, která odhalí předem stanovená nebezpečná klíčová slova. Dalším krokem je použití knihovny striptags na straně serveru, která odstraní všechny html tagy, není tedy potom možné spustit například script.

Pokud uživatel zadá do vstupu jakýkoli html tag je z uživatelského vstupu na straně serveru smazán ale vstup od uživatele je dále zpracován. Nemělo by tedy dojít k útoku. Pokud ale uživatel zadá některá z vybraných slov, zachytí je již javascript na straně uživatele a vůbec je nedovolí poslat na server.

### Přihlášení 
Uživatel se může zaregistrovat nebo přihlásit k již založenému účtu. Po přihlášení nebo po registraci se uloží do databáze token, který je vytvořen s pomocí JWT_SECRET aby bylo zajištěno, že není možné token změnit.
Vygenerovaný token je po přihlášení uživatele uložen do cookie. Uživatel může tedy stránku obnovit a stále zůstane přihlášený. 

Pokud se chce uživatel odhlásit klikne na tlačítko Log out a aplikace ho odhlásí a přesměruje zpět na Log in stránku.

