(function ($) {

AjaxSolr.ResultWidget = AjaxSolr.AbstractWidget.extend({
  
start: 0,

  facetLinks: function (facet_field, facet_values) {
    var links = [];
      if (facet_values) {
      for (var i = 0, l = facet_values.length; i < l; i++) {
        links.push(
          $('<a href="#"></a>')
          .text(facet_values[i])
          .click(this.facetHandler(facet_field, facet_values[i]))
      );
    }
  }
    return links;
},

  facetHandler: function (facet_field, facet_value) {
    var self = this;
    return function () {
      self.manager.store.remove('fq');
      self.manager.store.addByValue('fq', facet_field + ':' + AjaxSolr.Parameter.escapeValue(facet_value));
      self.doRequest(0);
      return false;
  };
},

  beforeRequest: function () {
  $(this.target).html($('<img>').attr('src', 'images/ajax-loader.gif'));
},


  afterRequest: function () {
    $(this.target).empty();
    for (var i = 0, l = this.manager.response.response.docs.length; i < l; i++) {
      var doc = this.manager.response.response.docs[i];
      $(this.target).append(this.template(doc));

      var items = [];

      /* Note: If using your own Solr instance, 
      you may want to change (or remove) the lines 
      adding facet links for topics, organisations and exchanges: */

      //items = items.concat(this.facetLinks('topics', doc.topics));
      //items = items.concat(this.facetLinks('organizations', doc.organisations));
      //items = items.concat(this.facetLinks('exchanges', doc.exchanges));

      var $links = $('#links_' + doc.id);
      $links.empty();
      for (var j = 0, m = items.length; j < m; j++) {
      $links.append($('<li></li>').append(items[j]));
  }
    }
  },

  template: function (doc) {
  var snippet = '';
  if (doc.content.length > 300) {
    snippet +=  doc.content.substring(0, 300);
    snippet += '<span style="display:none;">' + doc.content.substring(300);
    snippet += '</span> <a href="#" class="more">more</a>';
  }
  else {
    snippet += doc.content;
  }

    if(doc.title != undefined) {

    var output = '<div><h2>' + doc.title + '</h2>'; 
    output += '<p id="links_' + doc.id + '" class="links"></p>';
    output += '<p>' + snippet + '</p></div>';
    return output; 

    }
  },

init: function () {
  $(document).on('click', 'a.more', function () {
    var $this = $(this),
        span = $this.parent().find('span');

    if (span.is(':visible')) {
      span.hide();
      $this.text('more');
    }
    else {
      span.show();
      $this.text('less');
    }

    return false;
  });
  
  }

});

})(jQuery);