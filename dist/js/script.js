// function loadArticle() {
//     var x = new XMLHttpRequest();
//     x.onreadystatechange = function () {
//         if (this.readyState == 4 && this.status == 200) {
//             let articles = JSON.parse(this.response);
//             $.each(articles["DATA"], function (k, data) {
//                 let id = data["ID"]
//                 let title = data["TITLE"]
//                 let description = data["DESCRIPTION"]
//                 let row = "<tr><td>" + id + "</td><td>" + title + "</td><td>" + description + "</td>";
//                 $('tbody').append(row)
//             })
//         }
//     }

//     x.open('GET', 'json/article.json', true);
//     x.send();
// }

// loadArticle();


$(document).ready(function () {
    let queryRecord = 10;

    let interval = setInterval(getArticle, 1000);

    function getQueryUrl() {
        return 'http://api-ams.me/v1/api/articles?page=1&limit=' + queryRecord;
    }

    function getArticle() {

        $.ajax({
            url: getQueryUrl(queryRecord),
            method: 'GET',
            success: function (res) {
                let row = '';
                $.each(res['DATA'], function (k, v) {
                    let id = v['ID']
                    let title = v['TITLE']
                    let description = v['DESCRIPTION']
                    let button = "<button class='btn btn-sm btn-primary edit' data-id='" + id + "' data-title='" + title + "' data-description='" + description + "'>EDIT</button>"
                    let btnDelete = "<button class='btn btn-sm btn-danger delete' style='margin-left: 5px;' data-id='" + id + "' data-title='" + title + "' data-description='" + description + "'>DELETE</button>"

                    row += "<tr><td>" + id + "</td><td>" + title + "</td><td>" + description + "</td>" + "<td>" + button + btnDelete + "</td>";

                })
                $('tbody').html('')
                $('tbody').append(row)
            },
            error: function (err) {
                console.log(err)
            }
        })
    }

    getArticle();
    let currentId;
    $(document).on('click', '.edit', (e) => {
        // console.log($(e.target).data('id'))
        currentId = $(e.target).data('id')

        $('#title').val($(e.target).data('title'))
        $('#description').val($(e.target).data('description'))
        // console.log(typeof(currentId))
        $('.header-title').text('Edit')
        $('.footer-button').find('.btn-primary').addClass('edit-modal').removeClass('add-modal');
        $('#action').modal('show')

    })

    $(document).on('click', '.delete', (e) => {
        currentId = $(e.target).data('id')
        $('#modal-delete').modal('show')
    });

    $(document).on('click', '#delete-record', (e) => {
        $.ajax({
            url: 'http://api-ams.me/v1/api/articles/' + currentId,
            headers: {
                'Authentication': 'Basic QU1TQVBJQURNSU46QU1TQVBJUEBTU1dPUkQ=,',
                'content-type': 'application/json'
            },
            method: 'DELETE',
            success: function (res) {
                $('tbody').html('')
                getArticle()
            },
            error: function (err) {
                console.log(err)
            }
        })

    });
    $(document).on('click', '.edit-modal', (e) => {

        let title = $('#title').val()
        let description = $('#description').val()
        // console.log("title :" + title + " description : " + description)
        let data = {
            "TITLE": title,
            "DESCRIPTION": description,
            "AUTHOR": 0,
            "CATEGORY_ID": 0,
            "STATUS": "string",
            "IMAGE": "string"
        };


        $.ajax({
            url: 'http://api-ams.me/v1/api/articles/' + currentId,
            headers: {
                'Authentication': 'Basic QU1TQVBJQURNSU46QU1TQVBJUEBTU1dPUkQ=,',
                'content-type': 'application/json'
            },
            method: 'PUT',
            data: JSON.stringify(data),
            success: function (res) {
                console.log(res)
                $('tbody').html('');
                getArticle()
            },
            error: function (err) {
                console.log(err)
            }
        })
    })

    $(document).on('change', '#records', ()=>{
        let _this = $('#records');
        if(isNaN(_this.val()))
            return;
        if(_this.val() == '')
            return;
        if(_this.val() < 0)
            return;
        queryRecord = _this.val();
        getArticle();
    })

    $(document).on('click', '#btn-add', () => {
        $('.header-title').text('Add')
        $('.footer-button').find('.btn-primary').addClass('add-modal').removeClass('edit-modal');
        $('#title').val('');
        $('#description').val('');
        $('#action').modal('show')
    })

    $(document).on('click', '.add-modal', () => {
        let title = $('#title').val()
        let description = $('#description').val()
        // console.log("title :" + title + " description : " + description)
        let data = {
            "TITLE": title,
            "DESCRIPTION": description,
            "AUTHOR": 0,
            "CATEGORY_ID": 0,
            "STATUS": "string",
            "IMAGE": "string"
        }

        $.ajax({
            url: 'http://api-ams.me/v1/api/articles',
            headers: {
                'Authentication': 'Basic QU1TQVBJQURNSU46QU1TQVBJUEBTU1dPUkQ=,',
                'content-type': 'application/json'
            },
            method: 'POST',
            data: JSON.stringify(data),
            success: function (res) {
                console.log(res)
                $('tbody').html('');
                getArticle()
                // $.each(res['DATA'], function (k, v) {
                //     let id = v['ID']
                //     let title = v['TITLE']
                //     let description = v['DESCRIPTION']
                //     let button = "<button class='btn btn-outline-primary' data-id='"+id+"'>EDIT</button>"
                //     let row = "<tr><td>" + id + "</td><td>" + title + "</td><td>" + description + "</td>" + "<td>" + button + "</td>";

                //     $('tbody').append(row)
                // })
            },
            error: function (err) {
                console.log(err)
            }
        })
    })


})
