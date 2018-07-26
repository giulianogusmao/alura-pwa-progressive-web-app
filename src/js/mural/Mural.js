const Mural = (function(_render, Filtro){
    "use strict"

    let cartoes = pegaCartoesUsuario()

    const render = () => _render({cartoes: cartoes, filtro: Filtro.tagsETexto});
    render()

    Filtro.on("filtrado", render)

    function preparaCartao(cartao){
        console.log('preparaCartao');
        const urlsImagens = Cartao.pegaImagens(cartao);
        console.log(urlsImagens);

        urlsImagens.forEach(url => {
            console.log('carregando imagem... ' + url);

            fetch(url)
                .then(
                    foto => {
                        console.log('foto carregada. Abrindo cache para gravar url... ' + url);
                        caches.open('ceep-images')
                        .then(
                            (cache) => {
                                    console.log('cache aberto. gravando foto... ' + url);
                                    cache.put(url, foto)
                                    .then(
                                        () => console.log('foto gravada no cache com sucesso!'),
                                        err => console.error('Não foi possivel gravar a foto no cache ' + url)
                                    )
                                },
                                err => { console.error('Erro para abrir o cache para gravar a foto ' + url); }
                            )
                    },
                    err => { console.error('Não foi possivel carregar a foto para ser adicionada no cache ' + url); }
                );
        });


        cartao.on("mudanca.**", salvaCartoes)
        cartao.on("remocao", ()=>{
            cartoes = cartoes.slice(0)
            cartoes.splice(cartoes.indexOf(cartao),1)
            salvaCartoes()
            render()
        })
    }

    function pegaCartoesUsuario(){
        let cartoesLocal = JSON.parse(localStorage.getItem(usuario))
        if(cartoesLocal){
            return cartoesLocal.map(cartaoLocal => {
                let cartao = new Cartao(cartaoLocal.conteudo, cartaoLocal.tipo)
                preparaCartao(cartao)
                return cartao
            })
        } else {
            return []
        }
    }

    function salvaCartoes (){
        localStorage.setItem(usuario, JSON.stringify(
            cartoes.map(cartao => ({conteudo: cartao.conteudo, tipo: cartao.tipo}))
        ))
    }

    login.on("login", ()=>{
        cartoes = pegaCartoesUsuario()
        render()
    })

    login.on("logout", ()=> {
        cartoes = []
        render()
    })

    function adiciona(cartao){
        if(logado){
            cartoes.push(cartao)
            salvaCartoes()
            cartao.on("mudanca.**", render)
            preparaCartao(cartao)
            render()
            return true
        } else {
            alert("Você não está logado")
        }
    }

    return Object.seal({
        adiciona
    })

})(Mural_render, Filtro)
