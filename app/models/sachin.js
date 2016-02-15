import DS from 'ember-data';

export default DS.Model.extend({
  batting_score: DS.attr(),
  wickets: DS.attr(),
  runs_conceded: DS.attr(),
  catches: DS.attr(),
  stumps: DS.attr(),
  opposition: DS.attr(),
  ground: DS.attr(),
  date: DS.attr(),
  match_result: DS.attr(),
  result_margin: DS.attr(),
  toss: DS.attr(),
  batting_innings: DS.attr()
});
