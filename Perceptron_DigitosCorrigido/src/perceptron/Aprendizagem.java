package perceptron;

/**
 *
 * @author Samylle
 */
public class Aprendizagem {

    private double[][] x;
    private double[][] w;
    private double[][] saidasDesejadas;
    private int epocas;

    public Aprendizagem(double[][] entradas, double[][] saidasDesejadas) {
        this.x = entradas;
        this.saidasDesejadas = saidasDesejadas;
        this.w = new double[saidasDesejadas[0].length][x[0].length]; 
        this.epocas = 0;
        inicializaPesos();
    }

    private void inicializaPesos() {
        
        for (int i = 0; i < w.length; i++) {
            for (int j = 0; j < w[0].length; j++) {
                w[i][j] = 0;
            }
        }
    }

    private double somatorio(int exemplo, int neuronio) {
        double y = 0;
        for (int j = 0; j < x[0].length; j++) {
            y += x[exemplo][j] * w[neuronio][j];
        }
        return y;
    }

    private double funcaoAtivacao(double y, double limiar) {
        if (y > limiar) return 1;
        else if (y < -limiar) return -1;
        else return 0;
    }

    public void treinar(double alfa, double limiar, int maxEpocas) {
        epocas = 0;
        boolean erro;

        do {
            erro = false;
            epocas++;

            for (int i = 0; i < x.length; i++) {   
                for (int n = 0; n < saidasDesejadas[0].length; n++) { 
                    double y = somatorio(i, n);
                    double saidaObtida = funcaoAtivacao(y, limiar);
                    double t = saidasDesejadas[i][n];

                    if (saidaObtida != t) {
                        erro = true;
                        
                        for (int j = 0; j < x[0].length; j++) {
                            w[n][j] += alfa * (t - saidaObtida) * x[i][j];
                        }
                    }
                }
            }
        } while (erro && epocas < maxEpocas);
    }

    public double[][] getPesos() {
        return w;
    }

    public int getEpocas() {
        return epocas;
    }
}