var gProjs


function initPage() {
    console.log('Starting up');
    gProjs = createProjs()
    renderProjs(gProjs)
}

function createProjs() {
    var projs = [{
        "id": "minesweeper",
        "name": "minesweeper",
        "title": "Try not to explode",
        "desc": "Yonatan the little ran in the morning to the garden",
        "url": "projs/minesweeper/index.html",
        "publishedAt": formatTime(1536538265600),//sept.
        "labels": ["Matrixes", "keyboard events"]
    },
    {
        "id": "book-shop",
        "name": "book shop",
        "title": "Manage your book store",
        "desc": "View/update/add/delete your books",
        "url": "projs/bookshop/index.html",
        "publishedAt": formatTime(1539538265600),//oct
        "labels": ["Matrixes", "keyboard events"]
    },
    {
        "id": "backgammon",
        "name": "backgammon",
        "title": "Train your Shesh-Besh skills",
        "desc": "Play a game of Shesh-Besh against a friend",
        "url": "projs/backgammon/index.html",
        "publishedAt": formatTime(1536538265600),//sept.
        "labels": ["Matrixes", "CSS", "drag & drop events"]
    },
    {
        "id": "balloons",
        "name": "balloons",
        "title": "Watch them float away",
        "desc": "Balloons are flying up up and away, you can also pop them.",
        "url": "projs/balloon-pop/index.html",
        "publishedAt": formatTime(1536538265600),//sept.
        "labels": ["movement", "CSS", "drag & drop events"]
    },
    {
        "id": "balboard",
        "name": "ballboard",
        "title": "Catch all the balls",
        "desc": "Run around and catch all the balls, avoid the sticky glue",
        "url": "projs/ballboard/index.html",
        "publishedAt": formatTime(1536538265600),//sept.
        "labels": ["movement", "CSS"]
    }

    ]
    return projs
}

function renderProjs(projs) {
    var strHtmlsPortfolios = ''
    var strHtmlsModals = ''
    var i = 0;
    projs.forEach(function(proj) {
        i++
        strHtmlsPortfolios += renderProj(proj,i)[0]
        strHtmlsModals += renderProj(proj,i)[1]
    })

    $protfolio = $('#portfolio .row:nth-child(2)')
    $protfolio.html(strHtmlsPortfolios)

    $body = $('body')
    $body.append(strHtmlsModals) 
}

function renderProj(proj,i) {

    var nameCapital = ''
    nameCapital += proj.name.charAt(0).toUpperCase()
    for (var idx = 1; idx < proj.name.length; idx++) {
        nameCapital += proj.name.charAt(idx)
    
    }
    

    var strHtmlPortfolio = `<div class="col-md-4 col-sm-6 portfolio-item">
                                <a class="portfolio-link" data-toggle="modal" href="#portfolioModal${i}">
                                <div class="portfolio-hover">
                                    <div class="portfolio-hover-content">
                                    <i class="fa fa-plus fa-3x"></i>
                                    </div>
                                </div>
                                <img class="img-fluid" src="img/portfolio/${proj.name}.jpg">
                                </a>
                                <div class="portfolio-caption">
                                <h4>${nameCapital}</h4>
                                <p class="text-muted">${proj.title}</p>
                                </div>
                            </div>`



    var strHtmlModal = `  <div class="portfolio-modal modal fade" id="portfolioModal${i}" tabindex="-1" role="dialog" aria-hidden="true">
                            <div class="modal-dialog">
                                <div class="modal-content">
                                <div class="close-modal" data-dismiss="modal">
                                    <div class="lr">
                                    <div class="rl"></div>
                                    </div>
                                </div>
                                <div class="container">
                                    <div class="row">
                                    <div class="col-lg-8 mx-auto">
                                        <div class="modal-body">
                                        <!-- Project Details Go Here -->
                                        <h2>${nameCapital}</h2>
                                        <p class="item-intro">${proj.title}</p>
                                        <img class="img-fluid d-block mx-auto img-thumbnail" src="img/portfolio/${proj.name}-full.jpg" alt="">
                                        <p>${proj.desc}</p>
                                        <a href="${proj.url}">Give my ${nameCapital} a try</a>
                                        <ul class="list-inline">
                                            <li>Date: ${proj.publishedAt}</li>
                                        </ul>
                                        <button class="btn btn-primary" data-dismiss="modal" type="button">
                                            <i class="fa fa-times"></i>
                                            Close Project</button>
                                        </div>
                                    </div>
                                    </div>
                                </div>
                                </div>
                            </div>
                            </div>`
    return [strHtmlPortfolio,strHtmlModal]
}



function goGmail() {
    var email = $('#email').val()
    var subject = $('#subject').val()
    var message = $('#message').val()
    
    $('#email').val('')
    $('#subject').val('')
    $('#message').val('')
    
    var url = `https://mail.google.com/mail/?view=cm&fs=1&to=${email}&su=${subject}&body=${message}`
    window.location.assign(url)

}


function formatTime(timeStamp) {
    return moment(timeStamp).format('MM/YYYY')
}