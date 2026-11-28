-- Resultado do 2º turno de 2026 (TSE). O percentual da Visão geral é calculado AQUI, na view, não no site.

create table public.election_votes (
  candidate text primary key,
  party     text,
  votes     bigint not null check (votes >= 0)
);

insert into public.election_votes (candidate, party, votes) values
  ('Luiz Inácio Lula da Silva', 'PT', 64256232),
  ('Flávio Bolsonaro',          'PL', 59826041);

-- Percentual sobre os votos válidos do 2º turno, com 2 casas (Lula: 51,79).
create view public.election_result with (security_invoker = true) as
select candidate, party, votes,
       round(votes * 100.0 / sum(votes) over (), 2) as pct
from public.election_votes;

alter table public.election_votes enable row level security;

create policy "anon read"    on public.election_votes for select to anon using (true);
create policy "auth read"    on public.election_votes for select to authenticated using (true);
create policy "editor write" on public.election_votes for all to authenticated using (public.is_editor()) with check (public.is_editor());

grant select on public.election_result to anon, authenticated;
