$(function () {
    //1.文章类别列表展示
    initArCateList();
    //封装函数
    function initArCateList() {
        $.ajax({
            url: '/my/article/cates',
            success: function (res) {
                var str = template("tpl-table", res);
                $('tbody').html(str);
            }
        })
    }
    //未添加类别按钮绑定点击事件
    var layer = layui.layer;
    var indexAdd = null;
    $("#btnAdd").on("click", function () {
        //利用框架代码,显示提示添加文章类别区域
        indexAdd = layer.open({
            type: 1,
            title: '添加文章分类',
            area: ['500px', '260px'],
            content: $('#dialog-add').html()
        });
    })


    //通过代理的形式为 form-add 表单绑定 submit 事件
    $('body').on('submit', '#form-add', function (e) {
        e.preventDefault();
        $.ajax({
            method: 'POST',
            url: '/my/article/addcates',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                layer.msg("恭喜您,添加文章分类成功!");
                initArCateList();
                layer.close(indexAdd);
            }

        })
    })
    // 4.修改-弹出层的改变
    var indexEdit = null
    $('tbody').on('click', '.btn-edit', function () {
        indexEdit = layer.open({
            // type=1 是没有确定按钮
            type: 1,
            title: '修改文章分类',
            area: ['500px', '300px'],
            content: $("#dialog-edit").html() //这里content是一个普通的String
        });
        //4.2 获取Id,发送ajax获取数据,渲染到页面
        var Id = $(this).attr("data-id");
        $.ajax({
            method: 'GET',
            url: '/my/article/cates/' + Id,
            success: function (res) {
                layui.form.val("form-edit", res.data)
            }
        })
    })
    //5.提交 -修改
    $("body").on("submit", '#form-edit', function (e) {
        e.preventDefault()
        $.ajax({
            method: 'POST',
            url: '/my/article/updatecate',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                //因为我们更新成功了,所以要重新渲染页面中的数据
                initArCateList();
                layer.msg("恭喜您,文章类别更新成功!");
                layer.close(indexEdit);
            }
        })
    })

    //6.删除
    $("tbody").on('click', '.btn-delete', function () {
        //  1.先获取Id ，进入到函数中this代指就改变了
        var Id = $(this).attr("data-id");
        // 显示对话框

        layer.confirm('是否确认删除?', { icon: 3, title: '提示' }, function () {
            $.ajax({
                method: 'GET',
                url: '/my/article/deletecate/' + Id,
                success: function (res) {
                    if (res.status !== 0) {
                        return layer.msg(res.message)
                    }
                    initArCateList()
                    layer.msg('恭喜您,删除成功!')
                    layer.close(indexEdit)
                }
            })
        });
        // layer.confirm('是否确认删除?', { icon: 3, title: '提示' },
        //     function () {
        //         $.ajax({
        //             method: 'GET',
        //             url: '/my/article/deletecate/' + Id,
        //             success: function (res) {
        //                 if (res.status !== 0) {
        //                     return layer.msg(res.message)
        //                 }
        //                 // 因为我们更新成功，要冲新渲染页面上的数据
        //                 initArtCateList();
        //                 layer.msg("恭喜您，文章类别删除成功！");
        //                 layer.close(index)
        //             }
        //         })
        //     })

    })


})