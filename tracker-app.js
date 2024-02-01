const registerServiceWorker = async () => {
  if ('serviceWorker' in navigator) {
    try {
      const registration = await navigator.serviceWorker.register('sw.js', { scope: './' });
    } catch (error) {
      console.error(`Registration failed with ${error}`);
    }
  }
};
registerServiceWorker();

window.SUFFIX = location.search.replace('?', ''); //.toLowerCase();
// à voir

const STATUSES = ["btn-danger", "btn-success", "btn-info"];

function get_categories() {
    let categories = [];
    let lines = (localStorage["t_categories"+SUFFIX] || "").trim().split('\n');
    if (lines.length == 1 && lines[0] == '') lines = [];
    for (let line of lines) {
        line = line.trim();
        if (line.startsWith("# ")) {
            categories.push({
                name: line.substring(2),
                exercises: [],
            });
        } else if (!line.length) {
            if (categories.length) {
                categories[categories.length-1].exercises.push(null); // horizontal space (separator)
            }
        } else {
            //if (line.startsWith("\\# ")) line = line.substring(1);
            let pos_space = line.indexOf(" ");
            if (pos_space == -1) {
                console.error("Invalid format for exercises");
                continue; // skip this invalid line
            }
            let id = parseInt(line.substring(0, pos_space).split(':')[0]);
            if (!isFinite(id)) {
                console.error("Invalid format : id isn't an integer");
                continue;
            }
            // id MUST be unique across exercises
            // id ~should be integers, risk of interference with SUFFIX have integers
            // -> should be integers since id created by function are integers...
            // -> must be integers
            let text = line.substring(pos_space+1).trim();
            let comment = text.indexOf(' // ') == -1 ? null : text.split(' // ').slice(1).join(' // ').trim();
            text = text.split(' // ')[0].trim()
            if (categories.length == 0) {
                categories.push({
                    name: "",
                    exercises: [],
                });
            }
            categories[categories.length-1].exercises.push([id, text, comment]);
        }
    }
    for (let category of categories) {
        while (category.exercises.length != 0 && category.exercises[category.exercises.length-1] == null) {
            category.exercises.pop();
        }
    }
    return categories;
}
