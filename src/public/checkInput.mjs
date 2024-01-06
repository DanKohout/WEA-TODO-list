export function check(input, type) {
    if(type === "email"){
        if(validateEmail(input)){
            return true
        }else{
            return false
        }
    }else if(type === "password" || type === "normalInput") {
        if(input.length > 6){
            if(!input.includes("eval") && !input.includes("setTimeout") && !input.includes("setInterval") && !input.includes("new Function") && !input.includes("script")){
                if(type === "password"){
                    if(!input.toLowerCase.includes("password")){
                        return true
                    }
                }else{
                    return true
                }
            }else{
                return false
            }
        }else{
            return false
        }
    }
}
const validateEmail = (email) => {
    return String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      )
  }