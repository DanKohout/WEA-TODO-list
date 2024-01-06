**Adresa aplikace:** https://-----.com/

Je možné si vytvořit vlastního uživatele s dodžením instrukcí ohledně vytvoření hesla, nebo se přihlásit pomocí již existujícího uživatele (email: name@example.com, heslo: user0123/).

**JSON formát:** https://-----.com/json

Data JSON formátu jsou k zobrazení po kliknutí na tlačítko s textem JSON data. Pro zobrazení dat ve formátu JSON je nutné aby byl uživatel přihlášen.

### Upozornění
Po přidání, úpravě, popřípadě odstranění úkolu je někdy nutné stránku načíst znovu. Toto je způsobeno tím, že změnit něco je časově náročnější než samotné čtení. Tedy stránka se po přidání obnoví, ale zobrazí stará data (tento problém nenastává na localhostu, ale když je aplikace nasazena na -----, někdy k tomuto problému může dojít).

### Zabezpečení - ošetření vstupu
Pro ošetření vstupu se používá funce, která odhalí předem stanovená nebezpečná klíčová slova. Dalším krokem je použití knihovny striptags na straně serveru, která odstraní všechny html tagy, není tedy potom možné spustit například script.

Pokud uživatel zadá do vstupu jakýkoli html tag je z uživatelského vstupu na straně serveru smazán ale vstup od uživatele je dále zpracován. Nemělo by tedy dojít k útoku. Pokud ale uživatel zadá některá z vybraných slov, zachytí je již javascript na straně uživatele a vůbec je nedovolí poslat na server.

### Přihlášení 
Uživatel se může zaregistrovat nebo přihlásit k již založenému účtu. Po přihlášení nebo po registraci se uloží do databáze token, který je vytvořen s pomocí JWT_SECRET aby bylo zajištěno, že není možné token změnit.
Vygenerovaný token je po přihlášení uživatele uložen do cookie. Uživatel může tedy stránku obnovit a stále zůstane přihlášený. 

Pokud se chce uživatel odhlásit klikne na tlačítko Log out a aplikace ho odhlásí a přesměruje zpět na Log in stránku.

