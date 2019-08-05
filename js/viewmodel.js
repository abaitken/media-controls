function ViewModel()
{
    var self = this;    
    self.dataReady = ko.observable(false);
    self.messages = ko.observable('Fetching...');
    
    self.Init = function ()
    {
        ko.applyBindings(self);
		$('#treeview')
              .on('changed.jstree', function (e, data) {
                var r = [];
                for(var i = 0, j = data.selected.length; i < j; i++) {
                  r.push(data.instance.get_node(data.selected[i]).id);
                }
                
                var id = r[0];
                
                var url = 'http://dnlaapi.services.lan/index.php/info/' + id;
                
                $.ajax({
						type: 'GET',
						url: url,
						dataType: 'json',
						mimeType: 'application/json',
						success: function (data) {
							$('#track-info').html(data['title']);
						},
						error: function(jqXHR, textStatus, errorThrown) {
							self.messages(errorThrown);
							$('#messages').attr("class","alert alert-danger");
							// TODO : Text not displaying correctly
                            $('#track-info').html("Error: " + errorThrown);
						}
					});
              });
              
		$('#treeview').jstree({
			'core' : {
				'data' : function (node, cb) {
					if(node.id === "err")
						return;
					
					var url = 'http://dnlaapi.services.lan/index.php/browse'
					if(node.id !== "#")
						url = url + '/' + node.id;
					
					$.ajax({
						type: 'GET',
						url: url,
						dataType: 'json',
						mimeType: 'application/json',
						success: function (data) {
							var nodes = [];
							
							if(data['container'])
								if(Array.isArray(data.container))
									data.container.forEach(function(item, index, array){
										nodes.push({"text" : item['title'], "id" : item['@attributes']['id'], "children" : item['@attributes']['childCount'] !== '0'});
									});
								else
								{
									var item = data.container;
									nodes.push({"text" : item['title'], "id" : item['@attributes']['id'], "children" : item['@attributes']['childCount'] !== '0'});
								}
							
							if(data['item'])
								if(Array.isArray(data.item))
									data.item.forEach(function(item, index, array){
										nodes.push({"text" : item['title'], "id" : item['@attributes']['id'], "children" : false, "icon" : "jstree-file"});
									});
								else
								{
									var item = data.item;
									nodes.push({"text" : item['title'], "id" : item['@attributes']['id'], "children" : false, "icon" : "jstree-file"});
								}
								
							cb(nodes);
						},
						error: function(jqXHR, textStatus, errorThrown) {
							self.messages(errorThrown);
							$('#messages').attr("class","alert alert-danger");
							// TODO : Text not displaying correctly
							cb([{"text" : "Error: " + errorThrown, "id" : "err", "children" : false}]);
						}
					});
				}
			}
		});
		self.dataReady(true);
	
    };
}

var vm = new ViewModel();
vm.Init();