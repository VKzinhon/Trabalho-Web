class Calculadora {

    constructor() {
        this.nrVisor = '0';
        this.ptDecimal = false;
        this.iniciouSegundo = false;
        this.memTemp = '';
        this.estadoErro = false;
        this.memoria = 0;
        this.op = {
            NOP: 0,
            DIV: 1,
            MULT: 2,
            SUB: 3,
            SUM: 4
        };
        this.opAtual = this.op.NOP;
        this.visorLigado = true;
        this.memoriaArmazenada = false;
    }

    trocarSinal() {
        if (this.nrVisor !== '0') { // Certifique-se de que o número no visor não é zero
            // Verifica se o número no visor é negativo
            if (this.nrVisor.charAt(0) === '-') {
                this.nrVisor = this.nrVisor.slice(1); // Remove o sinal negativo
            } else {
                this.nrVisor = '-' + this.nrVisor; // Adiciona um sinal negativo
            }
        }
    }

    porcentagem() {
        if (this.estadoErro) return;
        let numero1 = parseFloat(this.memTemp);
        let numero2 = parseFloat(this.nrVisor);
        let resultado = numero1 / 100 * numero2;
        this.nrVisor = String(resultado);
    }

    mostrarVisor() {
        if (!this.visorLigado) {
            return ''; // Retorna visor vazio se estiver desligado
        }
        if (this.estadoErro) {
            return 'ERRO!'; // Retorna mensagem de erro se houver erro
        }
        let visor = '';
        if (this.memTemp !== '') {
            visor += this.memTemp; // Mostra o número armazenado em memTemp
            switch (this.opAtual) {
                case this.op.DIV:
                    visor += ' /';
                    break;
                case this.op.MULT:
                    visor += ' x';
                    break;
                case this.op.SUB:
                    visor += ' -';
                    break;
                case this.op.SUM:
                    visor += ' +';
                    break;
                default:
                    break;
            }
        }
        visor += this.nrVisor;
        if (this.memoriaArmazenada) {
            visor += ' M'; // Adiciona indicador de memória armazenada
        }
        // Limita o visor a 10 caracteres
        if (visor.length > 10) {
            visor = visor.substring(0, 10);
        }
        return visor;
    }
    
    ligarDesligarVisor() {
        this.visorLigado = !this.visorLigado;
        if (!this.visorLigado) {
            this.nrVisor = '0';
            this.ptDecimal = false;
            this.iniciouSegundo = false;
            this.opAtual = this.op.NOP;
            this.memTemp = '';
            this.estadoErro = false;
        }
    }

    quadrado() {
        if (this.estadoErro) return;
        let numero = parseFloat(this.nrVisor);
        let resultado = numero * numero;
        this.nrVisor = String(resultado).slice(0, 10); // Limita o resultado a 10 caracteres no visor
    }



    // recebe dígito
    digito(dig) {
        if (this.estadoErro) return;
        if (dig.length != 1) return;
        if ((dig < '0' || dig > '9') && dig != '.') return;
        if (!this.iniciouSegundo && this.opAtual != this.op.NOP) {
            this.iniciouSegundo = true;
            this.ptDecimal = false;
            this.nrVisor = '0';
        }
        if (this.nrVisor.length == 10) return;
        if (dig == '.') {
            if (this.ptDecimal) return;
            this.ptDecimal = true;
        }
        if (this.nrVisor == '0') {
            this.nrVisor = dig == '.' ?  '0.' : dig;
        } else {
            this.nrVisor += dig;
        }
    }

    // Definir qual a operação atual
    defineOperacao(op) {
        if (this.estadoErro) return;
        switch (op) {
            case '+':
                this.opAtual = this.op.SUM;
                break;
            case '-':
                this.opAtual = this.op.SUB;
                break;
            case '*':
                this.opAtual = this.op.MULT;
                break;
            case '/':
                this.opAtual = this.op.DIV;
                break;
        }
        this.memTemp = this.nrVisor;
    }

    // Executa operação: tecla IGUAL
    igual() {
        if (this.estadoErro) return;
        if (this.opAtual == this.op.NOP) return;
        let num1 = parseFloat(this.memTemp);
        let num2 = parseFloat(this.nrVisor);
        let resultado = 0;
        switch (this.opAtual) {
            case this.op.DIV:
                if (num2 == 0) {
                    this.estadoErro = true;
                    return;
                }
                resultado = num1/num2;
                break;
            case this.op.MULT:
                resultado = num1*num2;
                break;
            case this.op.SUB:
                resultado = num1 - num2;
                break;
            case this.op.SUM:
                resultado = num1 + num2;
                break;
        }
        this.opAtual = this.op.NOP;
        this.iniciouSegundo = false;
        this.ptDecimal = false;
        this.memTemp = '';
        this.nrVisor = String(resultado).slice(0, 10);
    }


    // Limpa dados (exceto memória)
    teclaC() {
        this.nrVisor = '0';
        this.ptDecimal = false;
        this.iniciouSegundo = false;
        this.opAtual = this.op.NOP;
        this.memTemp = '';
        this.estadoErro = false;
    }

    // tecla M+ : acrescenta à memória o número no visor
    teclaMmais() {
        if (this.estadoErro) return;
        this.memoria += parseFloat(this.nrVisor);
    }

    // tecla M- : subtrai da memória o número no visor
    teclaMmenos() {
        if (this.estadoErro) return;
        this.memoria -= parseFloat(this.nrVisor);
    }

    // tecla RM : recupera o conteúdo da memória -> coloca no visor
    teclaRM() {
        if (this.estadoErro) return;
        this.nrVisor = String(this.memoria);
    }

    // tecla CLM : limpa totalmente o conteúdo da memória -> atribui 0
    teclaCLM() {
        if (this.estadoErro) return;
        this.memoria = 0;
    }   

    raizQuadrada() {
        if (this.estadoErro) return;
        let numero = parseFloat(this.nrVisor);
        if (numero < 0) {
            this.estadoErro = true;
            return;
        }
        let resultado = Math.sqrt(numero);
        this.nrVisor = String(resultado).slice(0, 10);
    }



    }

    


// ==================================================================
//  RESPOSTAS A EVENTOS DO HTML
// ==================================================================

// ATUALIZA O VALOR NO VISOR
let atualizaVisor = () => {
    document.getElementById('visor-id').innerHTML = calculadora.mostrarVisor();
}

// RECEBE UM DÍGITO (OU PONTO)
let digito = (dig) => {
    calculadora.digito(dig);
    atualizaVisor();
}

// RECEBE OPERAÇÃO ATUAL
let defOp = (op) => {
    if (calculadora.opAtual != calculadora.op.NOP) {
        defIgual();
        atualizaVisor();
    }
    calculadora.defineOperacao(op);
}

// CALCULA A OPERAÇÃO
let defIgual = () => {
    calculadora.igual();
    atualizaVisor();
}

// TECLA C: LIMPA TUDO, EXCETO MEMÓRIA
let teclaC = () => {
    calculadora.teclaC();
    atualizaVisor();
}

// M+ ACRESCENTA À MEMÓRIA O NÚMERO ATUAL NO VISOR
let teclaMmais = () => {
    calculadora.teclaMmais();
}

// M- SUBTRAI DA MEMÓRIA O NÚMERO ATUAL NO VISOR
let teclaMmenos = () => {
    calculadora.teclaMmenos();
}

// PÕE NO VISOR O CONTEÚDO DA MEMÓRIA
let teclaRM = () => {
    calculadora.teclaRM();
    atualizaVisor();
}

// APAGA TODO O CONTEÚDO DA MEMÓRIA
let teclaCLM = () => {
    calculadora.teclaCLM();
}

let On_off = () => {
    calculadora.ligarDesligarVisor();
    atualizaVisor();
}

let teclaMaisMenos = () => {
    calculadora.trocarSinal();
    atualizaVisor();
}

let porcentagem = () => {
    calculadora.porcentagem();
    atualizaVisor();
}

let teclaQuadrado = () => {
    calculadora.quadrado();
    atualizaVisor();
}


let raizQuadrada = () => {
    calculadora.raizQuadrada();
    atualizaVisor();
}
// ========================================================
//  INÍCIO DO PROCESSAMENTO
// ========================================================

let calculadora = new Calculadora();
