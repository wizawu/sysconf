const {
    PolymerLayout,
    React,
} = require("../namespace");

const {Box, Item} = PolymerLayout;

export default React.createClass({
    render() {
        let style = { width: 320 };

        return (
            <Box wrap>
                <Item style={style}>
                    <h3>Web Application Audit</h3>
                    <ul>
                        <li><a href="http://sourceforge.net/projects/dirb/">dirb</a></li>
                        <li>ratproxy</li>
                        <li>skipfish</li>
                        <li>sqlmap</li>
                        <li><a href="https://github.com/sandrogauci/wafw00f">wafw00f</a></li>
                        <li><a href="http://www.edge-security.com/wfuzz.php">Wfuzz</a></li>
                    </ul>
                </Item>

                <Item style={style}>
                    <h3>Server Audit</h3>
                    <ul>
                        <li><a href="https://github.com/fwaeytens/dnsenum">dnsenum</a></li>
                        <li>nikto</li>
                        <li>nmap</li>
                    </ul>
                </Item>

                <Item style={style}>
                    <h3>MITM</h3>
                    <ul>
                        <li><a href="https://github.com/DanMcInerney/LANs.py">LANs.py</a></li>
                        <li>mitmproxy</li>
                        <li>scapy</li>
                    </ul>
                </Item>

                <Item style={style}>
                    <h3>Network Attack</h3>
                    <ul>
                        <li>ettercap</li>
                        <li>hping</li>
                        <li title="-c 60000 -X -r 2000 -w 10 -y 20 -n 5 -z 2 -p 5 -l 3600 -u URL">slowhttptest</li>
                        <li><a href="https://www.thc.org/thc-ssl-dos/">THC-SSL-DOS</a></li>
                        <li><a href="http://www.infosec-ninjas.com/tsunami">tsunami</a></li>
                    </ul>
                </Item>

                <Item style={style}>
                    <h3>Intrusion Detection</h3>
                    <ul>
                        <li>etherape</li>
                        <li>snort</li>
                        <li>unhide</li>
                    </ul>
                </Item>

                <Item style={style}>
                    <h3>Password</h3>
                    <ul>
                        <li>crunch</li>
                        <li>hydra</li>
                        <li>medusa</li>
                        <li><a href="http://sourceforge.net/projects/rcracki/">rcracki_mt</a></li>
                        <li>unshadow + john</li>
                    </ul>
                </Item>

                <Item style={style}>
                    <h3>Hash</h3>
                    <ul>
                        <li><a href="https://github.com/psypanda/hashID">hashID</a></li>
                        <li><a href="https://code.google.com/p/findmyhash/">findmyhash.py</a></li>
                    </ul>
                </Item>

                <Item style={style}>
                    <h3>Compression/Encryption Algorithms</h3>
                    <ul>
                        <li>LZ4</li>
                        <li>Murmur</li>
                        <li>Twofish</li>
                    </ul>
                </Item>

                <Item style={style}>
                    <h3>More</h3>
                    <ul>
                        <li><a href="http://tools.kali.org/tools-listing">Kali Linux Tools Listing</a></li>
                    </ul>
                </Item>
            </Box>
        );
    }
});
