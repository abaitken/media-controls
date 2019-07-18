function ViewModel()
{
    var self = this;    
    self.dataReady = ko.observable(false);
    self.messages = ko.observable('Fetching...');
    
    self.Init = function ()
    {
        ko.applyBindings(self);
		
		$('#treeview').jstree({
			'core' : {
				'data' : function (node, cb) {
					if(node.id === "err")
						return;
					
					url = 'http://dlnarest.localhost:8080/index.php/browse'
					if(node.id !== "#")
						url = url + '/' + node.id;
					
					$.ajax({
						type: 'GET',
						url: url,
						dataType: 'json',
						mimeType: 'application/json',
						success: function (data) {
							var nodes = [];
							
							if(Array.isArray(data.container))
								data.container.forEach(function(item, index, array){
									nodes.push({"text" : item['title'], "id" : item['@attributes']['id'], "children" : item['@attributes']['childCount'] !== '0'});
								});
								
							if(Array.isArray(data.item))
								data.item.forEach(function(item, index, array){
									nodes.push({"text" : item['title'], "id" : item['@attributes']['id'], "children" : false, "icon" : "jstree-file"});
								});
							cb(nodes);
						},
						error: function(jqXHR, textStatus, errorThrown) {
							self.messages(errorThrown);
							$('#messages').attr("class","alert alert-danger");
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