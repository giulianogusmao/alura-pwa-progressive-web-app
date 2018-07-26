const version = 3;

self.addEventListener('install', function (event) {
    console.log('service worker instaled');
});

self.addEventListener('activate', function (event) {
    console.log('service worker activated');
    
    let arquivos = [
        '/',
        'css/estilos.css',
        'css/opcoesDaPagina.css',
        'css/opcoesDoCartao.css',
        'css/cabecalho.css',
        'css/login.css',
        'css/loginForm.css',
        'css/loginStatus.css',
        'css/cartao.css',
        'css/novoCartao.css',
        'css/mural.css',
        'js/lib/jquery.js',
        'js/lib/eventemitter2.js',
        'js/lib/KeyBoardNavigation.js',
        'js/tags/Tags.js',
        'js/cabecalho/mudaLayout.js',
        'js/cabecalho/busca.js',
        'js/filtro/Filtro.js',
        'js/tipos/TiposCartao.js',
        'js/cartao/render/Cartao_renderHelpers.js',
        'js/cartao/render/CartaoOpcoes_render.js',
        'js/cartao/render/CartaoConteudo_render.js',
        'js/cartao/render/Cartao_render.js',
        'js/cartao/Cartao.js',
        'js/login/LoginUsuario_render.js',
        'js/login/LoginUsuario.js',
        'js/mural/render/Mural_render.js',
        'js/mural/Mural.js',
        'js/cabecalho/novoCartao.js',
        'img/bin2.svg',
        'img/edit.svg'
    ];

    try {
        caches
            .open('ceep-arquivos-' + version)
            .then(cache => {
                cache
                    .addAll(arquivos)
                    .then(() => {
                        console.log('arquivos adicionados ao cache');

                        // removendo caches antigos
                        for (var i = version - 1; i >= 0; i--) {
                            let oldCache = 'ceep-arquivos' + (i > 0 ? `-${i}` : '');
                            // console.log('remove ' + oldCache);
                            caches.delete(oldCache);
                        }
                    });
            });
    } catch (e) {
        console.log('fodeo');
        console.log(e);
    }
});

self.addEventListener('fetch', function (event) {
    try {
        // console.log('Tentou carregar alguma coisa');

        let pedido = event.request;
        let promiseResposta = caches
            .match(pedido)
            .then(res => {
                // if (!res) {
                //     console.log('internet: ' + pedido.url);
                // }
                return res ? res : fetch(pedido);
            });

        event.respondWith(promiseResposta);

    } catch (e) {
        console.log('fodeo 2');
        console.log(e);
    }
});