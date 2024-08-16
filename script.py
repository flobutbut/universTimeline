import datetime
from SPARQLWrapper import SPARQLWrapper, JSON

import ssl
ssl._create_default_https_context = ssl._create_unverified_context

existing_branches = {
    "15": "Géologie",
    "22": "Histoire",
    "39": "Volcanologie"
}

existing_events = [
    {
        "id": "vesuvius_eruption",
        "title": "Éruption du Vésuve",
        "date": "79-10-24",
        "branches": ["15", "22", "39"]
    }
]

def query_wikidata(query):
    sparql = SPARQLWrapper("https://query.wikidata.org/sparql")
    sparql.setQuery(query)
    sparql.setReturnFormat(JSON)
    return sparql.query().convert()

def get_relevant_categories():
    query = """
    SELECT DISTINCT ?category ?categoryLabel
    WHERE {
      {
        ?category wdt:P279* wd:Q2373936.  # domaine d'étude
      } UNION {
        ?category wdt:P279* wd:Q11471.    # processus géologique
      } UNION {
        ?category wdt:P279* wd:Q11190.    # catastrophe naturelle
      }
      SERVICE wikibase:label { bd:serviceParam wikibase:language "fr,en". }
    }
    LIMIT 1000
    """
    results = query_wikidata(query)
    return {result["category"]["value"].split("/")[-1]: result["categoryLabel"]["value"] 
            for result in results["results"]["bindings"]}

def get_detailed_data(event, relevant_categories):
    query = f"""
    SELECT DISTINCT ?item ?itemLabel ?date ?category ?categoryLabel ?relatedEvent ?relatedEventLabel
    WHERE {{
      ?item rdfs:label "{event['title']}"@fr.
      OPTIONAL {{ ?item wdt:P585 ?date. }}
      OPTIONAL {{ 
        ?item wdt:P31/wdt:P279* ?category. 
        ?category wdt:P279* ?topCategory.
        VALUES ?topCategory {{ wd:Q2373936 wd:Q11471 wd:Q11190 }}
        ?category rdfs:label ?categoryLabel. 
        FILTER(LANG(?categoryLabel) = "fr")
      }}
      OPTIONAL {{ 
        ?item ?relatedProp ?relatedEvent. 
        ?relatedEvent rdfs:label ?relatedEventLabel. 
        FILTER(?relatedProp IN (wdt:P828, wdt:P1365, wdt:P1366, wdt:P361))
        FILTER(LANG(?relatedEventLabel) = "fr") 
      }}
      SERVICE wikibase:label {{ bd:serviceParam wikibase:language "fr,en". }}
    }}
    LIMIT 1000
    """
    results = query_wikidata(query)
    
    event_data = {
        "id": event["id"],
        "title": event["title"],
        "date": event["date"],
        "categories": set(),
        "relatedEvents": set(),
        "branches": set(existing_branches[b] for b in event["branches"])
    }
    
    for result in results["results"]["bindings"]:
        if "categoryLabel" in result:
            category = result["categoryLabel"]["value"]
            event_data["categories"].add(category)
            if category in relevant_categories.values():
                event_data["branches"].add(category)
        
        if "relatedEventLabel" in result:
            event_data["relatedEvents"].add(result["relatedEventLabel"]["value"])
    
    event_data["categories"] = list(event_data["categories"])
    event_data["relatedEvents"] = list(event_data["relatedEvents"])
    event_data["branches"] = list(event_data["branches"])
    
    return event_data

# Script principal
relevant_categories = get_relevant_categories()
vesuvius_event = existing_events[0]
detailed_event = get_detailed_data(vesuvius_event, relevant_categories)

print("Détails de l'éruption du Vésuve:")
print(f"- {detailed_event['title']} ({detailed_event['date']})")
print(f"Branches pertinentes:")
for branch in detailed_event['branches']:
    print(f"  - {branch}")
print("Catégories:")
for category in detailed_event['categories']:
    print(f"  - {category}")
if detailed_event['relatedEvents']:
    print("Événements liés:")
    for related_event in detailed_event['relatedEvents']:
        print(f"  - {related_event}")