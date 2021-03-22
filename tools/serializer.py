from flask import jsonify

def serializer(query_result_without_fetchall):
    columns = [column[0] for column in query_result_without_fetchall.description]
    results = []
    for row in query_result_without_fetchall.fetchall():
        results.append(dict(zip(columns, row )))
    return results

def CamelCase(word):
        return ''.join(x.capitalize() or ' ' for x in word.split(' '))

        