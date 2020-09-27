﻿using System;
using System.Diagnostics;
using System.IO;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;

namespace TodoApi.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class QueryController : ControllerBase
    {

        private readonly ILogger<QueryController> _logger;

        public QueryController(ILogger<QueryController> logger)
        {
            _logger = logger;
        }

        [HttpPost]
        public async Task<string> Post()
        {   
            var payload_str = "";
            using (var ms = new MemoryStream(2048))
            {
                await Request.Body.CopyToAsync(ms);
                payload_str = Encoding.ASCII.GetString(ms.ToArray());                
            }

            var ql_code = run_cmd("/home/simon/Documents/dev/EIMC/Backend/QL4BIMserver/im2ql/main.py", payload_str);
            return "test";
        }

        public string run_cmd(string cmd, string args)
        {
            ProcessStartInfo start = new ProcessStartInfo();
            start.FileName = "/home/simon/.local/share/virtualenvs/im2ql-FysY6N98/bin/python3";
            args = args.Replace("\"", "$");
            
            start.Arguments = string.Format("{0} \"{1}\"", cmd, args);
            start.UseShellExecute = false;// Do not use OS shell
            start.CreateNoWindow = true; // We don't need new window
            start.RedirectStandardOutput = true;// Any output, generated by application will be redirected back
            start.RedirectStandardError = true; // Any error in standard output will be redirected back (for example exceptions)
            using (Process process = Process.Start(start))
            {
                using (StreamReader reader = process.StandardOutput)
                {
                    string stderr = process.StandardError.ReadToEnd(); // Here are the exceptions from our Python script
                    string result = reader.ReadToEnd(); // Here is the result of StdOut(for example: print "test")
                    return result;
                }
            }
        }


        [HttpGet]
        public String Get()
        {
            return "hello from the ql4bim server for eimc";
        }
    }
}