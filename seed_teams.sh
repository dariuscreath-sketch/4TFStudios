#!/bin/bash
# Seed teams for all leagues

# FIFA World Cup
team-db "INSERT OR IGNORE INTO teams VALUES ('team-arg', 'Argentina', 'fifa-wc', '🇦🇷')"
team-db "INSERT OR IGNORE INTO teams VALUES ('team-fra', 'France', 'fifa-wc', '🇫🇷')"
team-db "INSERT OR IGNORE INTO teams VALUES ('team-bra', 'Brazil', 'fifa-wc', '🇧🇷')"
team-db "INSERT OR IGNORE INTO teams VALUES ('team-eng', 'England', 'fifa-wc', '🏴󠁧󠁢󠁥󠁮󠁧󠁿')"

# La Liga
team-db "INSERT OR IGNORE INTO teams VALUES ('team-fcb', 'FC Barcelona', 'laliga', '🔵🔴')"
team-db "INSERT OR IGNORE INTO teams VALUES ('team-atm', 'Atletico Madrid', 'laliga', '🔴⚪')"

# Serie A
team-db "INSERT OR IGNORE INTO teams VALUES ('team-juve', 'Juventus', 'seriea', '⚫⚪')"
team-db "INSERT OR IGNORE INTO teams VALUES ('team-acm', 'AC Milan', 'seriea', '🔴⚫')"
team-db "INSERT OR IGNORE INTO teams VALUES ('team-int', 'Inter Milan', 'seriea', '🔵⚫')"

# Bundesliga
team-db "INSERT OR IGNORE INTO teams VALUES ('team-bay', 'Bayern Munich', 'bundesliga', '🔴')"
team-db "INSERT OR IGNORE INTO teams VALUES ('team-dor', 'Borussia Dortmund', 'bundesliga', '🟡⚫')"

# Ligue 1
team-db "INSERT OR IGNORE INTO teams VALUES ('team-psg', 'PSG', 'ligue1', '🔵🔴')"
team-db "INSERT OR IGNORE INTO teams VALUES ('team-ol', 'Olympique Lyonnais', 'ligue1', '🔵🔴')"

# MLS
team-db "INSERT OR IGNORE INTO teams VALUES ('team-lafc', 'LAFC', 'mls', '🖤')"
team-db "INSERT OR IGNORE INTO teams VALUES ('team-nyr', 'NY Red Bulls', 'mls', '🔴')"

# NHL
team-db "INSERT OR IGNORE INTO teams VALUES ('team-tor', 'Toronto Maple Leafs', 'nhl', '🔵')"
team-db "INSERT OR IGNORE INTO teams VALUES ('team-mon', 'Montreal Canadiens', 'nhl', '🔴')"
team-db "INSERT OR IGNORE INTO teams VALUES ('team-edm', 'Edmonton Oilers', 'nhl', '🟠')"

# NCAA Football
team-db "INSERT OR IGNORE INTO teams VALUES ('team-ala', 'Alabama Crimson Tide', 'ncaa-fb', '🔴')"
team-db "INSERT OR IGNORE INTO teams VALUES ('team-uga', 'Georgia Bulldogs', 'ncaa-fb', '🔴⚫')"
team-db "INSERT OR IGNORE INTO teams VALUES ('team-mich', 'Michigan Wolverines', 'ncaa-fb', '💛💙')"
team-db "INSERT OR IGNORE INTO teams VALUES ('team-ohio', 'Ohio State Buckeyes', 'ncaa-fb', '🟤')"
team-db "INSERT OR IGNORE INTO teams VALUES ('team-usc', 'USC Trojans', 'ncaa-fb', '❤️💛')"

# NCAA Basketball
team-db "INSERT OR IGNORE INTO teams VALUES ('team-unc', 'UNC Tar Heels', 'ncaa-bb', '🔵')"
team-db "INSERT OR IGNORE INTO teams VALUES ('team-duke', 'Duke Blue Devils', 'ncaa-bb', '🔵')"
team-db "INSERT OR IGNORE INTO teams VALUES ('team-ku', 'Kansas Jayhawks', 'ncaa-bb', '🔵🔴')"
team-db "INSERT OR IGNORE INTO teams VALUES ('team-uk', 'Kentucky Wildcats', 'ncaa-bb', '🔵')"
team-db "INSERT OR IGNORE INTO teams VALUES ('team-ucla', 'UCLA Bruins', 'ncaa-bb', '💙💛')"

# WNBA
team-db "INSERT OR IGNORE INTO teams VALUES ('team-lva', 'Las Vegas Aces', 'wnba', '🔴')"
team-db "INSERT OR IGNORE INTO teams VALUES ('team-nyli', 'New York Liberty', 'wnba', '🔵🟡')"

echo "All teams seeded!"
