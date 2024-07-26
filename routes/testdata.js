var express = require('express');
var router = express.Router();
const archiver = require('archiver');
const fs = require('fs');
const path = require('path');
var dblink = require('../lib/components/dblink');
var _config = require('../lib/config').config;

router.get('/download/:pid', function(req, res, next) {
    var pid = req.params.pid;
    dblink.problemManager.problemContent(pid, function(pcontent, pinfo, psubmit) {
        var ttl = pinfo && pinfo[0] && pinfo[0].ttl;
        dblink.problemManager.downloadList(pid, function(file_list) {
            res.render('layout', {
                layout: 'testdata_download',
                subtitle: 'Testdata',
                user: req.session,
                problemtitle: pid + '. ' + ttl,
                pid: pid,
                downloadList: file_list
            });
        });
    });
});

router.get('/download-all/:pid', (req, res) => {
    const pid = req.params.pid;
    const testdataDir = path.join(_config.RESOURCE.public.testdata, pid);
    const publicDir = path.join(__dirname, '../public'); // Adjust this path if needed
    
    // Ensure the directory exists
    if (!fs.existsSync(testdataDir)) {
        return res.status(404).send('Testdata not found.');
    }

    const zipFileName = `p${pid}_testdata.zip`;
    const testScriptName = 'runTest.sh';
    const testScriptPath = path.join(publicDir, testScriptName);

    if (!fs.existsSync(testScriptPath)) {
        return res.status(404).send('Test script not found.' + testScriptPath);
    }

    // Set headers to trigger download in browser
    res.setHeader('Content-Disposition', `attachment; filename=${zipFileName}`);
    res.setHeader('Content-Type', 'application/zip');

    const archive = archiver('zip', {
        zlib: { level: 9 }
    });

    archive.on('error', function(err) {
        res.status(500).send({ error: err.message });
    });

    archive.pipe(res);

    dblink.problemManager.downloadList(pid, function(file_list) {
        file_list.forEach(file => {
            const filePath = path.join(testdataDir, file);
            archive.file(filePath, { name: file });
        });
        archive.file(testScriptPath, {name: testScriptName});
        archive.finalize();
    });

}); 

// router.get('/manage', function(req, res, next) {
//     var uid = req.session.uid;
//     dblink.helper.isAdmin(uid, function(isadmin) {
//         if (isadmin) {
//             res.render('layout', {
//                 layout: 'testdata_manage',
//                 subtitle: 'Testdata',
//                 user: req.session
//             });
//         } else {
//             res.redirect(loginURL);
//         }
//     });
// });

module.exports = router;
