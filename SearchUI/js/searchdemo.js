var Manager;

(function ($) {

  $(function () {
    Manager = new AjaxSolr.Manager({
      solrUrl: 'http://localhost:8983/solr/'
    });
    Manager.addWidget(new AjaxSolr.ResultWidget({
      id: 'result',
      target: '#docs'
    }));

    Manager.addWidget(new AjaxSolr.PagerWidget({

      id: 'pager',
  	  target: '#pager',
  	  prevLabel: '&lt;',
  	  nextLabel: '&gt;',
  	  innerWindow: 1,
  	  renderHeader: function (perPage, offset, total) {
   		 $('#pager-header').html($('<span></span>').text('displaying ' + Math.min(total, offset + 1) + ' to ' + Math.min(total, offset + perPage) + ' of ' + total));
  	  }
	}));

	Manager.addWidget(new AjaxSolr.CurrentSearchWidget({
  		id: 'currentsearch',
  		target: '#selection',
	}));


	Manager.addWidget(new AjaxSolr.AutocompleteWidget({
  		id: 'text',
  		target: '#search',
      fields: ['url', 'content', 'title'] // chanage for topic, organizations
  }));

  Manager.addWidget(new AjaxSolr.CalendarWidget({
      id: 'calendar',
      target: '#calendar',
      field: 'date'
  }));


    var fields = [ 'url', 'title', 'content']; //'topics', 'organisations' 
    for (var i = 0, l = fields.length; i < l; i++) {
      Manager.addWidget(new AjaxSolr.TagcloudWidget({
        id: fields[i],
        target: '#' + fields[i],
        field: fields[i]
      }));
    }

    Manager.init();
    //moved the next two calls inside the initialization block
    Manager.store.addByValue('q', '*:*');
    var params = {
      facet: true,
      'facet.field': [ 'url', 'title', 'content'], //change to topics and organizations after fixing the solr index
      'facet.limit': 20,
      'facet.mincount': 1,
      'f.topics.facet.limit': 50,
      'json.nl': 'map',
      'facet.date': 'date',
      'facet.date.start': '2000-01-01T00:00:00.000Z/DAY',
      'facet.date.end': '2018-12-31T00:00:00.000Z/DAY+1DAY',
      'facet.date.gap': '+1DAY',
    };
    for (var name in params) {
      Manager.store.addByValue(name, params[name]);
    }

    Manager.doRequest();
  });

})(jQuery);